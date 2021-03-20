// BotShu
// Felipe Bojorquez
// 2021
// Automatic !eng command. If a user is detected to not be in English, tag the
// user with a warning.
require("dotenv").config();
const tmi = require("tmi.js");

// Globals
const production = process.env.PRODUCTION_MONKAW === "production";
const VERSION_NUMBER = "3";
var botEnabled = false;
var userStrikes = {};

// Add a server so that App Service can ping the app and get a response
const server = require("./server.js");
server.initializeServer(VERSION_NUMBER);

const lang = require("./language.js");

// Throttling logic
var messageTimes = [];
const TIMESTAMP_ARRAY_SIZE = 10;
var oldestTimestampIndex = 0;
var newestTimestampIndex = TIMESTAMP_ARRAY_SIZE - 1;
var languageProcessingSleeping = false;
// The timestamp array keeps track of the last
// TIMESTAMP_ARRAY_SIZE messages to see if
// messages are being sent too quickly.
initializeTimestampArray();

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true,
    },
    identity: {
        username: "modshu",
        password: process.env.CHAT_ACCESS_TOKEN,
    },
    channels:
        process.env.PRODUCTION_MONKAW === "production"
            ? ["mushu", "febog"]
            : ["febog"],
});

client.connect();

// Gets called every time a new message arrives to the chat
client.on("message", async (channel, user, message, self) => {
    // If the message comes from the bot itself, ignore.
    if (self) return;

    let canManageBot = userCanManageBot(user);

    // Handle enable/disable logic
    if (canManageBot) {
        handleBotEnabledFlag(channel, message);
    }

    if (!botEnabled) return;

    // Configuration logic

    if (canManageBot && message === "!botshu reset all") {
        userStrikes = new Map();
        client.say(channel, `Strikes have been reset`);
    } else if (canManageBot && message.startsWith("!botshu reset")) {
        // Remove "!botshu reset" from the message and get the words
        const args = message.slice(14).split(" ");
        // Get the name if given after the word "reset"
        const firstArg = args.shift().toLowerCase();
        if (userStrikes.has(firstArg)) {
            // User found, reset their strikes
            if (userStrikes.delete(firstArg)) {
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
        if (userStrikes.has(firstArg)) {
            // User found, print their strkes
            let strikeCount = userStrikes.get(firstArg);
            client.say(channel, `@${firstArg} has ${strikeCount} strikes`);
        } else {
            // Username not found
            client.say(channel, `Username "${firstArg}" has no strikes`);
        }
    }

    // Language processing logic

    // Throttling
    if (languageProcessingSleeping) return;
    recordMessageTimestamp();

    // If this is production and the message is from a sub, mod or broadcaster,
    // ignore
    if (production && (user.subscriber || canManageBot)) return;

    let languageResult = await lang.detectLanguage(message);

    // If debugging print detected language and confidence
    if (!production) {
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

        if (!userStrikes.has(user.username)) {
            // No strikes, first warning
            userStrikes.set(user.username, 1); // First strike
            client.say(
                channel,
                `[WARNING] @${user.username} Keep the chat in English. Why? - !whyeng`
            );
        } else if (userStrikes.get(user.username) === 1) {
            // Second strike, last warning
            userStrikes.set(user.username, 2); // Second strike
            client.say(
                channel,
                `[LAST WARNING] @${user.username} ENGLISH ONLY PLEASE. Why? - !whyeng`
            );
        } else if (userStrikes.get(user.username) >= 2) {
            // This is the third or more time, timeout
            client.timeout(channel, user.username, 600, "Chat not in English");
        }
    }
});

/**
 * Enable/disable logic.
 * @param {string} channel
 * @param {string} message
 */
function handleBotEnabledFlag(channel, message) {
    if (!botEnabled && message === "!botshu on") {
        botEnabled = true;
        userStrikes = new Map();
        client.say(channel, `BotShu is now enabled mushHii`);
    } else if (message === "!botshu off") {
        botEnabled = false;
        userStrikes = {};
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

function initializeTimestampArray() {
    // Fill the circular array with zeros
    for (let i = 0; i < TIMESTAMP_ARRAY_SIZE; i++) {
        messageTimes.push(0);
    }
}

// If more the newest and oldest timestamps have less than
// a second of difference, it means that TIMESTAMP_ARRAY_SIZE
// messages were sent in less than a second
function recordMessageTimestamp() {
    // Move oldest pointer
    oldestTimestampIndex = ++oldestTimestampIndex % TIMESTAMP_ARRAY_SIZE;
    // Move newest pointer
    newestTimestampIndex = ++newestTimestampIndex % TIMESTAMP_ARRAY_SIZE;
    // Write new newest value
    messageTimes[newestTimestampIndex] = Date.now();
    // Compare with old to see if it elapsed more than a second (these are
    // milliseconds)
    let diff =
        messageTimes[newestTimestampIndex] - messageTimes[oldestTimestampIndex];
    if (diff < 2000) {
        console.log("Messages are occuring too fast, sleeping");
        languageProcessingSleeping = true;
        setTimeout(() => {
            languageProcessingSleeping = false;
            console.log(`No longer sleeping`);
        }, 60000); // sleep 60 seconds (1 min)
    }
}
