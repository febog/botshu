// BotShu
// Felipe Bojorquez
// 2021
// Automatic !eng command. If a user is detected to not be in English, tag the user with a warning.
const tmi = require('tmi.js');
const { TextAnalyticsClient, AzureKeyCredential } = require('@azure/ai-text-analytics');
const key = process.env.TEXT_ANALYTICS_KEY;
const endpoint = 'https://botshu-language-detection.cognitiveservices.azure.com/';
const textAnalyticsClient = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key));

const debugging = true;

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
client.on('message', async (channel, tags, message, self) => {
    // If the message comes from the bot itself, ignore.
    if (self) return;

    // Get language information from the message contents using Azure text analytics
    let languageResult = await languageDetection(message);

    // If debugging print detected language and confidence
    if (debugging) {
        console.log(`${tags['display-name']}: ${message} (${languageResult.name} (${languageResult.confidenceScore}) detected)`);
    }

    // If sure it's not English
    if (languageResult.name !== 'English' && languageResult.confidenceScore === 1) {
        client.say(channel, `[WARNING] @${tags.username} Keep the chat in English. Thank you. !whyeng`);
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
