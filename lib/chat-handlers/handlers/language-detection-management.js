const ChatMessageHandler = require("../chat-message-handler.js");

const {
    USER_STRIKES_RESET_COMMAND,
    GET_USER_COUNT_COMMAND,
} = require("../commands.js");

const languageDetectionManagementHandlers = [
    function resetUserStrikes(p) {
        if (p.message.startsWith(USER_STRIKES_RESET_COMMAND)) {
            // Remove "!botshu reset" from the message and get the words
            const args = p.message.slice(14).split(" ");
            // Get the name if given after the word "reset"
            const firstArg = args.shift().toLowerCase();
            if (firstArg === "all") {
                p.store.resetAllStrikes();
                p.client.say(p.channel, `Strikes have been reset`);
                return;
            }
            if (p.store.userHasStrikes(firstArg)) {
                // User found, reset their strikes
                if (p.store.removeUserStrikes(firstArg)) {
                    // The username existed and has been removed
                    p.client.say(
                        p.channel,
                        `Strikes have been reset for ${firstArg}`
                    );
                }
            } else {
                // Username not found
                p.client.say(p.channel, `Username "${firstArg}" not found`);
            }
        }
    },
    function getUserCount(p) {
        if (p.message.startsWith(GET_USER_COUNT_COMMAND)) {
            // Remove "!botshu count" from the message and get the words
            const args = p.message.slice(14).split(" ");
            // Get the name if given after the word "count"
            const firstArg = args.shift().toLowerCase();
            if (p.store.userHasStrikes(firstArg)) {
                // User found, print their strkes
                let strikeCount = p.store.getUserStrikes(firstArg);
                p.client.say(
                    p.channel,
                    `@${firstArg} has ${strikeCount} strikes`
                );
            } else {
                // Username not found
                p.client.say(p.channel, `@${firstArg} has no strikes`);
            }
        }
    },
];

/**
 * Commands that globally enable and disable the chat bot functionality.
 */
module.exports = class LanguageDetectionManagementHandler extends ChatMessageHandler {
    constructor() {
        super(languageDetectionManagementHandlers);
    }
};
