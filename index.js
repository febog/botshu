// BotShu
// Felipe Bojorquez
// 2021
require("dotenv").config();
const tmi = require("tmi.js");
const store = require("./lib/global-bot-state.js");
const server = require("./lib/app.js");
const lang = require("./lib/language/language.js");
const parameters = require("./lib/handlers/handler-parameter.js");
const messageHandlers = require("./lib/handlers/message-handlers.js");

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

// Gets called every time a new message arrives to the chat
client.on("message", async (channel, user, message, self) => {
    // If the message comes from the bot itself, ignore.
    if (self) return;

    parameters.setParameters(client, channel, user, message, store);
    let p = parameters.getParameters();

    messageHandlers.handleMessage(p);

    await lang.handleMessageLanguage(p);
});

server.initializeBotServer(store);
client.connect();
