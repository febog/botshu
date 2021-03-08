// BotShu
// Felipe Bojorquez
// 2021
// Automatic !eng command. If a user is detected to not be in English, tag the user with a warning.
const tmi = require('tmi.js');
const { TextAnalyticsClient, AzureKeyCredential } = require('@azure/ai-text-analytics');
const key = process.env.TEXT_ANALYTICS_KEY;
const endpoint = 'https://botshu-language-detection.cognitiveservices.azure.com/';
const textAnalyticsClient = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key));

const production = process.env.PRODUCTION_MONKAW === 'production';
var botEnabled = false;
var userStrikes = {};

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    identity: {
        username: 'modshu',
        password: process.env.CHAT_ACCESS_TOKEN
    },
    channels: ['febog']
});

client.connect();

// Gets called every time a new message arrives to the chat
client.on('message', async (channel, user, message, self) => {
    // If the message comes from the bot itself, ignore.
    if (self) return;

    // Enable/disable logic

    let isModOrBroadcaster = user.mod || user.badges?.broadcaster === '1';
    if (!botEnabled && isModOrBroadcaster && (message === '!botshu on')) {
        botEnabled = true;
        userStrikes = new Map();
        client.say(channel, `BotShu is now enabled mushHii`);
    } else if (isModOrBroadcaster && (message === '!botshu off')) {
        botEnabled = false;
        userStrikes = {};
        client.say(channel, `BotShu is now disabled PETTHEMODS`);
    }
    if (!botEnabled) return;

    // Configuration logic

    if (isModOrBroadcaster && (message === '!botshu reset all')) {
        userStrikes = new Map();
        client.say(channel, `BotShu strikes have been reset`);
    } else if (isModOrBroadcaster && message.startsWith('!botshu reset')) {
        // Remove "!botshu reset" from the message and get the words
        const args = message.slice(14).split(' ');
        // Get the name if given after the word "reset"
        const firstArg = args.shift().toLowerCase();
        if (userStrikes.has(firstArg)) {
            // User found, reset their strikes
            if (userStrikes.delete(firstArg)) {
                // The username existed and has been removed
                client.say(channel, `BotShu strikes have been reset for ${firstArg}`);
            }
        } else {
            // Username not found
            client.say(channel, `Username "${firstArg}" not found`);
        }
    } else if (isModOrBroadcaster && message.startsWith('!botshu count')) {
        // Remove "!botshu count" from the message and get the words
        const args = message.slice(14).split(' ');
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

    // If this is production and the message is from a sub, mod or broadcaster, ignore
    if (production && (user.subscriber || isModOrBroadcaster)) return;

    // Get language information from the message contents using Azure text analytics
    let languageResult = await languageDetection(message);

    // If debugging print detected language and confidence
    if (!production) {
        console.log(`${user['display-name']}: ${message} (${languageResult.name} (${languageResult.confidenceScore}) detected)`);
    }

    // If sure it's not English
    if (languageResult.name !== 'English' && languageResult.confidenceScore === 1) {
        if (!userStrikes.has(user.username)) {
            // No strikes, first warning
            userStrikes.set(user.username, 1); // First strike
            client.say(channel, `[WARNING] @${user.username} Keep the chat in English. Why? - !whyeng`);
        } else if (userStrikes.get(user.username) === 1) {
            // Second strike, last warning
            userStrikes.set(user.username, 2); // Second strike
            client.say(channel, `[LAST WARNING] @${user.username} ENGLISH ONLY PLEASE. Why? - !whyeng`);
        } else if (userStrikes.get(user.username) >= 2) {
            // This is the third or more time, timeout
            client.timeout(channel, user.username, 600, "Chat not in English");
        }
    }
});

async function languageDetection(message) {
    const languageResult = await textAnalyticsClient.detectLanguage([message]);

    let result = {};
    languageResult.forEach(document => {
        result = document.primaryLanguage;
    });
    return result;
}
