// BotShu
// Felipe Bojorquez
// 2021
// Automatic !eng command. If a user is detected to not be in English, tag the
// user with a warning.
require("dotenv").config();
const tmi = require("tmi.js");

const store = require("./lib/bot-state.js");
const server = require("./lib/server.js");
const lang = require("./lib/language.js");
const throttling = require("./lib/throttling.js");
server.initializeServer(store.getVersion());

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true,
    },
    identity: {
        username: "modshu",
        password: process.env.CHAT_ACCESS_TOKEN,
    },
    channels: store.isProduction() ? ["mushu", "febog"] : ["febog"],
});

client.connect();

// Gets called every time a new message arrives to the chat
client.on("message", async (channel, user, message, self) => {
    // If the message comes from the bot itself, ignore.
    if (self) return;

    let canManageBot = userCanManageBot(user);

    // Handle enable/disable logic
    if (canManageBot) {
        handleBotEnabledFlag(channel, message, store);
    }

    if (!store.isBotEnabled()) return;

    // Configuration logic

    if (canManageBot && message === "!botshu reset all") {
        store.resetAllStrikes();
        client.say(channel, `Strikes have been reset`);
    } else if (canManageBot && message.startsWith("!botshu reset")) {
        // Remove "!botshu reset" from the message and get the words
        const args = message.slice(14).split(" ");
        // Get the name if given after the word "reset"
        const firstArg = args.shift().toLowerCase();
        if (store.userHasStrikes(firstArg)) {
            // User found, reset their strikes
            if (store.removeUserStrikes(firstArg)) {
                // The username existed and has been removed
                client.say(channel, `Strikes have been reset for ${firstArg}`);
            }
        } else {
            // Username not found
            client.say(channel, `Username "${firstArg}" not found`);
        }
    } else if (canManageBot && message.startsWith("!botshu count")) {
        // Remove "!botshu count" from the message and get the words
        const args = message.slice(14).split(" ");
        // Get the name if given after the word "count"
        const firstArg = args.shift().toLowerCase();
        if (store.userHasStrikes(firstArg)) {
            // User found, print their strkes
            let strikeCount = store.getUserStrikes(firstArg);
            client.say(channel, `@${firstArg} has ${strikeCount} strikes`);
        } else {
            // Username not found
            client.say(channel, `Username "${firstArg}" has no strikes`);
        }
    }

    // Language processing logic

    // Throttling
    if (store.getLanguageSleepState().sleeping) return;
    throttling.checkThrottling(store.getLanguageSleepState());

    // If this is production and the message is from a sub, mod or broadcaster,
    // ignore
    if (store.isProduction() && (user.subscriber || canManageBot)) return;

    let languageResult = await lang.detectLanguage(message);

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
            client.timeout(channel, user.username, 600, "Chat not in English");
        }
    }
});

/**
 * Enable/disable logic.
 * @param {string} channel Channel name.
 * @param {string} message Message received.
 * @param {Object} store Bot state.
 */
function handleBotEnabledFlag(channel, message, store) {
    if (!store.isBotEnabled() && message === "!botshu on") {
        store.turnBotOn();
        client.say(channel, `BotShu is now enabled mushHii`);
    } else if (message === "!botshu off") {
        store.turnBotOff();
        client.say(channel, `BotShu is now disabled PETTHEMODS`);
    }
}

/**
 * Returns true if the user can manage the bot.
 * Only moderators and the broadcaster can manage the bot.
 * @param {Object} user The user object given by tmi.js.
 * @returns True if the user can manage the bot.
 */
function userCanManageBot(user) {
    return (
        user.mod ||
        user.badges?.broadcaster === "1" ||
        user.username === "febog"
    );
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
