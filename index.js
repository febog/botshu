const tmi = require('tmi.js');
const { TextAnalyticsClient, AzureKeyCredential } = require('@azure/ai-text-analytics');
const key = process.env.TEXT_ANALYTICS_KEY;
const endpoint = 'https://botshu-language-detection.cognitiveservices.azure.com/';
const textAnalyticsClient = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key));


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

client.on('message', async (channel, tags, message, self) => {
    if (self) return;
    let languageResult = await languageDetection(message);
    console.log(`${tags['display-name']}: ${message} (${languageResult.name} (${languageResult.confidenceScore}) detected)`);
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
