// BotShu
// Felipe Bojorquez
// 2021
// Automatic !eng command. If a user is detected to not be in English, tag the
// user with a warning.
require("dotenv").config();
const tmi = require("tmi.js");
const store = require("./lib/bot-state.js");
const server = require("./lib/server.js");
const management = require("./lib/management.js");
const lang = require("./lib/language.js");
const onOff = require("./lib/enable-disable.js");

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

    if (canManageBot) {
        onOff.runEnableDisableCommands(client, channel, user, message, store);
    }

    if (!store.isBotEnabled()) return;

    if (canManageBot) {
        management.runManagementCommands(client, channel, user, message, store);
    }

    await lang.handleMessageLanguage(client, channel, user, message, store);
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
