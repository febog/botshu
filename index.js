// BotShu
// Felipe Bojorquez
// 2021
require("dotenv").config();
const tmi = require("tmi.js");
const store = require("./lib/bot-state.js");
const server = require("./lib/server.js");
const lang = require("./lib/language/language.js");
const parameters = require("./lib/handlers/handler-parameter.js");
const onOff = require("./lib/handlers/enable-disable.js");
const management = require("./lib/handlers/management.js");
const publicCommands = require("./lib/handlers/public-commands.js");
const nonSub = require("./lib/handlers/nonsub-handler.js");

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

    let canManageBot = userCanManageBot(user);

    parameters.setParameters(client, channel, user, message, store);
    let p = parameters.getParameters();

    if (canManageBot) {
        onOff.runEnableDisableHandlers(p);
    }

    if (!store.isBotEnabled()) return;

    if (canManageBot) {
        management.runManagementHandlers(p);
    }

    await lang.handleMessageLanguage(client, channel, user, message, store);

    publicCommands.runPublicCommands(client, channel, user, message, store);

    if (!user.subscriber) {
        nonSub.handleNonSubMessages(p);
    }
});

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

server.initializeServer(store.getVersion());
client.connect();
