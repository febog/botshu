// BotShu
// Felipe Bojorquez
// 2021-2023
require("dotenv").config();
const { RefreshingAuthProvider } = require("@twurple/auth");
const { ChatClient } = require("@twurple/chat");
const { ApiClient } = require("@twurple/api");
const { EventSubWsListener } = require("@twurple/eventsub-ws");

// Web Server dependencies for website and socket.io
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

const storage = require("./lib/storage/storage.js");
const stream = require("./lib/events/stream.js");
const chatEvents = require("./lib/events/chat-events.js");
const store = require("./lib/global-bot-state.js");
const botServer = require("./lib/server/server.js");
const extensionEmotes = require("./lib/services/extension-emotes.js");

const BotShu = require('./lib/botshu.js');

// Place the partner plus state in the store
const plusPoints = require("./lib/partner-plus/points.js");
store.setPlusPoints(plusPoints);

async function startBotshu() {
    // Setup initial global state
    await extensionEmotes.loadThirdPartyEmotes(store);

    // Prepare Twurple authentication provider
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
    const authProvider = new RefreshingAuthProvider({
        clientId,
        clientSecret,
        onRefresh: async (userId, newTokenData) =>
            await storage.storeJsonToBlobStorage(
                newTokenData,
                `token.${userId}.json`
            ),
    });

    const botTokenBlob = `token.${process.env.TWITCH_USER_ID_MODSHU}.json`;
    const botTokenData = await storage.readJsonFromBlobStorage(botTokenBlob);
    await authProvider.addUserForToken(botTokenData, ["chat"]);
    const streamTokenBlob = `token.${process.env.TWITCH_USER_ID_MUSHU}.json`;
    const streamTokenData = await storage.readJsonFromBlobStorage(streamTokenBlob);
    await authProvider.addUserForToken(streamTokenData);

    // Create Twitch API client
    const apiClient = new ApiClient({ authProvider });

    // Connect to chat
    const channels = store.isProduction() ? ["mushu", "febog"] : ["febog"];
    const chatClient = new ChatClient({ authProvider, channels });

    // Start main application logic
    const botShu = new BotShu(chatClient, apiClient, io, storage, store);
    botShu.start();

    chatEvents.handleChatEvents(chatClient, io, store);

    // Start HTTP server, express app for the bot website and socket.io
    botServer.initializeBotServer(express, app, server, io, port, store);

    // // Setup WebSocket EventSub listener for listening to stream changes
    const listener = new EventSubWsListener({ apiClient });
    listener.start();
    stream.setupStreamState(apiClient, chatClient, listener, store);

    chatClient.connect();
}

startBotshu();
