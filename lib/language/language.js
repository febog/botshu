// Automatic !eng command. If a user is detected to not be in English, tag the
// user with a warning.
// Warns user if message is not following language rules and times out after 3
// strikes.
const languageDetection = require("./language-detection.js");
const throttling = require("./throttling.js");
// Timeout time in seconds
const TIMEOUT_TIME = 5;

/**
 * Automatic !eng command logic.
 * @param {Object} p Message handler parameter object.
 */
async function handleMessageLanguage(p) {
    // Only perform language analysis if bot is enabled and stream is online
    if (!p.store.isBotEnabled() || !p.store.isStreamLive()) return;

    // Throttling
    if (p.store.getLanguageSleepState().sleeping) return;
    throttling.checkThrottling(p.store.getLanguageSleepState());

    if (isUserExempt(p.msg.userInfo)) return;

    // Ignore commands
    if (p.message.startsWith("!")) return;

    let msg = prepareMessage(p.store, p.message);

    // If message is less than 3 characters, ignore
    if (msg.length < 3) return;

    let languageResult = await languageDetection.detectLanguage(msg);
    let flaggableMessage = isFlaggableMessage(p, languageResult, msg);

    if (flaggableMessage) {
        if (p.store.isProduction()) {
            flagUser(p);
        } else {
            console.log("R OMEGALUL lled by the bot");
        }
    }

    if (!p.store.isProduction() || flaggableMessage) {
        // Print detected language and confidence
        console.log(
            `${p.msg.userInfo.displayName}: ${msg} (${languageResult.name} (${languageResult.confidenceScore}) detected)`
        );
    }
}

/**
 * Check if we should flag this message based con the language detection results
 * and the message itself.
 * @param {Object} p Message handler parameter object.
 * @param {Object} languageResult |DetectedLanguage| object with the detection
 * results.
 * @param {string} message Analyzed chat message.
 * @returns True if we are confident the message is in another language.
 */
function isFlaggableMessage(p, languageResult, message) {
    if (languageResult.name === "English") return false;

    // Remove extra whitespace and count words
    let wordCount = message.split(" ").length;

    // Arbitrary set of rules to trust or not the language detection results.
    // Some languages that have a small amount of words are low confidence and
    // thus not be cosidered flaggable messages.

    if (
        languageResult.name === "Russian" &&
        (languageResult.confidenceScore > 0.8 ||
            (languageResult.confidenceScore > 0.7 && wordCount > 1))
    ) {
        p.client.say(
            p.channel,
            `@${p.msg.userInfo.displayName} Почему только английский в чате? - БÓльшая часть зрителей этого канала не из России, и чтобы все могли понимать друг друга, чат ТОЛЬКО на английском языке. Спасибо за понимание`
        );
        return true;
    }

    if (
        languageResult.name === "Spanish" &&
        ((languageResult.confidenceScore === 1 && wordCount > 1) ||
            (languageResult.confidenceScore > 0.9 && wordCount > 2))
    ) {
        return true;
    }

    if (
        languageResult.name === "French" &&
        languageResult.confidenceScore === 1 &&
        wordCount > 2
    ) {
        return true;
    }

    if (
        languageResult.name === "Polish" &&
        languageResult.confidenceScore === 1 &&
        wordCount > 1
    ) {
        return true;
    }

    if (
        languageResult.name === "Japanese" &&
        languageResult.confidenceScore > 0.9
    ) {
        return true;
    }

    if (
        languageResult.name === "Arabic" &&
        languageResult.confidenceScore > 0.9
    ) {
        return true;
    }

    if (
        languageResult.name === "Portuguese" &&
        ((languageResult.confidenceScore === 1 && wordCount > 2) ||
            (languageResult.confidenceScore > 0.9 && wordCount > 3))
    ) {
        return true;
    }

    if (
        languageResult.name === "Greek" &&
        languageResult.confidenceScore > 0.8
    ) {
        return true;
    }

    // Not confident enough with any of the previous languages so we don't flag
    // the message.
    return false;
}

/**
 * Strikes logic. Tags user if it has 0 or 1 strikes or timeouts if it has 2 or
 * more.
 * @param {Object} p Message handler parameter object.
 */
async function flagUser(p) {
    if (!p.store.userHasStrikes(p.user)) {
        // No strikes, first warning
        p.store.addUserStrike(p.user); // First strike
        p.client.say(
            p.channel,
            `Hello @${p.msg.userInfo.displayName} please keep the chat in English. Why? - !whyeng [WARNING]`
        );
    } else if (p.store.getUserStrikes(p.user) === 1) {
        // Second strike, last warning
        p.store.addUserStrike(p.user); // Second strike
        p.client.say(
            p.channel,
            `[LAST WARNING] @${p.msg.userInfo.displayName} ENGLISH ONLY PLEASE. Why? - !whyeng`
        );
        const timeoutDetails = {
            user: p.msg.userInfo.userId,
            reason: "[Botshu] [LAST WARNING] Chat not in English",
            duration: TIMEOUT_TIME,
        };
        await p.apiClient.moderation.banUser(
            p.msg.channelId,
            process.env.TWITCH_USER_ID_MODSHU,
            timeoutDetails
        );
    } else if (p.store.getUserStrikes(p.user) >= 2) {
        // This is the third or more time, ban
        const timeoutDetails = {
            user: p.msg.userInfo.userId,
            reason: "[BotShu] Chat not in English"
        };
        await p.apiClient.moderation.banUser(
            p.msg.channelId,
            process.env.TWITCH_USER_ID_MODSHU,
            timeoutDetails
        );
    }
}

/**
 * Only non-subs are checked for language.
 * @returns True if user should be ignored for language detection.
 */
function isUserExempt(userInfo) {
    // Exempt if user is subscriber, mod or broadcaster.
    return userInfo.isSubscriber || userInfo.isMod || userInfo.isBroadcaster;
}

/**
 * Make some changes to the string before sending to language detection.
 * @param {Object} store Bot state.
 * @param {String} message Original chat message.
 * @returns Message processed for language detection.
 */
function prepareMessage(store, message) {
    // Remove emoji
    const matchEmoji =
        /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
    let noEmoji = message.replace(matchEmoji, "");

    // Remove extra whitespace and get words in the message as an array
    let words = noEmoji.replace(/\s+/g, " ").trim().split(" ");

    // Remove emotes
    words = words.filter((word) => !store.getEmoteList().includes(word));

    // Remove numbers
    const anyNumbers = /\b\d+\b/;
    words = words.filter((word) => !anyNumbers.test(word));

    // Remove Mushu emotes
    const mushuEmote = /\bmushu\w+\b/;
    words = words.filter((word) => !mushuEmote.test(word));

    // Remove @ mentions
    const mentions = /@\w+\b/;
    words = words.filter((word) => !mentions.test(word));

    let filteredMessage = words.join(" ");
    return filteredMessage;
}

module.exports = {
    handleMessageLanguage,
};
