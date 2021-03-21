// Warns user if message is not following language rules and times out after 3
// strikes.
const languageDetection = require("./language-detection.js");
const throttling = require("./throttling.js");
// Timeout time in seconds
const TIMEOUT_TIME = 600;

/**
 * Automatic !eng command logic. Receives the parameters given by Tmi.js message
 * event.
 * @param {Object} client Tmi.js client.
 * @param {string} channel Channel name.
 * @param {Object} user Userstate object.
 * @param {string} message Message received.
 * @param {Object} store Bot state.
 */
async function handleMessageLanguage(client, channel, user, message, store) {
    // Throttling
    if (store.getLanguageSleepState().sleeping) return;
    throttling.checkThrottling(store.getLanguageSleepState());

    if (isUserExempt(user)) return;

    let languageResult = await languageDetection.detectLanguage(message);

    // If debugging print detected language and confidence.
    if (!store.isProduction()) {
        console.log(
            `${user["display-name"]}: ${message} (${languageResult.name} (${languageResult.confidenceScore}) detected)`
        );
    }

    if (isFlaggableMessage(languageResult, message)) {
        flagUser(client, channel, user, store);
    }
}

/**
 * If the language result has a high enough confidence of being in another
 * language, it returns true.
 * @param {Object} languageResult |DetectedLanguage| object.
 * @param {string} message Analyzed message.
 * @returns True if user should be tagged or timed out.
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
        languageResult.confidenceScore > 0.8
    ) {
        return true;
    }

    if (
        languageResult.name === "Spanish" &&
        languageResult.confidenceScore === 1 &&
        wordCount > 1
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
        languageResult.confidenceScore > 0.9
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
        languageResult.confidenceScore === 1 &&
        wordCount > 1
    ) {
        return true;
    }

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
