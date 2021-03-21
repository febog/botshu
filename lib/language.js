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
 * @param {ObjectConstructor} store Bot state.
 */
async function handleMessageLanguage(client, channel, user, message, store) {
    // Throttling
    if (store.getLanguageSleepState().sleeping) return;
    throttling.checkThrottling(store.getLanguageSleepState());

    if (isUserExempt(user)) return;

    let languageResult = await languageDetection.detectLanguage(message);

    // If debugging print detected language and confidence
    if (!store.isProduction()) {
        console.log(
            `${user["display-name"]}: ${message} (${languageResult.name} (${languageResult.confidenceScore}) detected)`
        );
    }

    // If sure it's not English
    if (
        languageResult.name !== "English" &&
        languageResult.confidenceScore === 1
    ) {
        // If the detected language is not supported, move on for now.
        if (!isLanguageSupported(languageResult.name)) return;

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
}

/**
 * Implementing this as a stopgap measure to reduce the number of false
 * positives.
 * @param {string} language Language detected on the message.
 * @returns true if language processing should continue.
 */
function isLanguageSupported(language) {
    // Only handle Russian and Spanish for now
    let supportedLanguages = ["Russian", "Spanish"];
    return supportedLanguages.includes(language);
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
