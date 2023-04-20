// BotShu
// Felipe Bojorquez
// 2021-2023
require("dotenv").config();
const { RefreshingAuthProvider } = require("@twurple/auth");
const { ChatClient } = require("@twurple/chat");
const { ApiClient } = require("@twurple/api");
const { EventSubWsListener } = require("@twurple/eventsub-ws");
const storage = require("./lib/storage/storage.js");
const stream = require("./lib/stream/stream.js");
const store = require("./lib/global-bot-state.js");
const server = require("./lib/server/app.js");
const lang = require("./lib/language/language.js");
const parametersClient = require("./lib/commands/common/handler-parameter.js");
const messageHandlers = require("./lib/commands/message-handlers.js");

async function startBotshu() {
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

    // Create Twitch API client
    const apiClient = new ApiClient({ authProvider });

    // Connect to chat
    const channels = store.isProduction() ? ["mushu", "febog"] : ["febog"];
    const chatClient = new ChatClient({ authProvider, channels });

    chatClient.onMessage(async (channel, user, text, msg) => {
        // If the message comes from the bot itself, ignore.
        if (user === "modshu") return;

        parametersClient.setParameters(
            chatClient,
            apiClient,
            channel,
            user,
            text,
            store,
            msg
        );
        let p = parametersClient.getParameters();

        messageHandlers.handleMessage(p);

        await lang.handleMessageLanguage(p);
    });

    // // Setup WebSocket EventSub listener for listening to stream changes
    // const listener = new EventSubWsListener({ apiClient });
    // listener.start();
    // stream.setupStreamState(apiClient, chatClient, listener, store);

    chatClient.connect();

    // Start express for the bot website
    server.initializeBotServer(store);
}

startBotshu();
