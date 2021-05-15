// Automatic !eng command. If a user is detected to not be in English, tag the
// user with a warning.
// Warns user if message is not following language rules and times out after 3
// strikes.
const languageDetection = require("./language-detection.js");
const throttling = require("./throttling.js");
// Timeout time in seconds
const TIMEOUT_TIME = 600;

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

    if (isUserExempt(p.user)) return;

    let languageResult = await languageDetection.detectLanguage(p.message);

    let flaggableMessage = isFlaggableMessage(languageResult, p.message);

    if (flaggableMessage) {
        flagUser(p.client, p.channel, p.user, p.store);
    }

    if (!p.store.isProduction() || flaggableMessage) {
        // Print detected language and confidence
        console.log(
            `${p.user["display-name"]}: ${p.message} (${languageResult.name} (${languageResult.confidenceScore}) detected)`
        );
    }
}

/**
 * Check if we should flag this message based con the language detection results
 * and the message itself.
 * @param {Object} languageResult |DetectedLanguage| object with the detection
 * results.
 * @param {string} message Analyzed chat message.
 * @returns True if we are confident the message is in another language.
 */
function isFlaggableMessage(languageResult, message) {
    if (languageResult.name === "English") return false;

    // Remove extra whitespace and count words
    let wordCount = message.replace(/\s+/g, " ").trim().split(" ").length;

    // Arbitrary set of rules to trust or not the language detection results.
    // Some languages that have a small amount of words are low confidence and
    // thus not be cosidered flaggable messages.

    if (
        languageResult.name === "Russian" &&
        (languageResult.confidenceScore > 0.8 ||
            (languageResult.confidenceScore > 0.7 && wordCount > 1))
    ) {
        return true;
    }

    // if (
    //     languageResult.name === "Spanish" &&
    //     ((languageResult.confidenceScore === 1 && wordCount > 1) ||
    //         (languageResult.confidenceScore > 0.4 && wordCount > 2))
    // ) {
    //     return true;
    // }

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
        ((languageResult.confidenceScore === 1 && wordCount > 1) ||
            (languageResult.confidenceScore > 0.4 && wordCount > 2))
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
 * @param {Object} client Tmi.js client.
 * @param {string} channel Channel name.
 * @param {Object} user Userstate object.
 * @param {Object} store Bot state.
 */
function flagUser(client, channel, user, store) {
    if (!store.userHasStrikes(user.username)) {
        // No strikes, first warning
        store.addUserStrike(user.username); // First strike
        client.say(
            channel,
            `[WARNING] @${user.username} Keep the chat in English. Why? - !whyeng`
        );
    } else if (store.getUserStrikes(user.username) === 1) {
        // Second strike, last warning
        store.addUserStrike(user.username); // Second strike
        client.say(
            channel,
            `[LAST WARNING] @${user.username} ENGLISH ONLY PLEASE. Why? - !whyeng`
        );
    } else if (store.getUserStrikes(user.username) >= 2) {
        // This is the third or more time, timeout
        client.timeout(
            channel,
            user.username,
            TIMEOUT_TIME,
            "Chat not in English"
        );
    }
}

/**
 * Only non-subs are checked for language.
 * @returns True if user should be ignored for language detection.
 */
function isUserExempt(user) {
    // Exempt if user is subscriber, mod or broadcaster.
    return user.subscriber || user.mod || user.badges?.broadcaster === "1";
}

module.exports = {
    handleMessageLanguage,
};
