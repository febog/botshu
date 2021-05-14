// Commands only available to moderators and the broadcaster. Related to the bot
// global enable or disable status.

const enableDisableCommands = {
    enableBot(client, channel, user, message, store) {
        if (!store.isBotEnabled() && message === "!botshu enable") {
            store.enableBot();
            client.say(channel, `BotShu is now enabled mushHii`);
        }
    },
    disableBot(client, channel, user, message, store) {
        if (store.isBotEnabled() && message === "!botshu disable") {
            store.disableBot();
            client.say(channel, `BotShu is now disabled PETTHEMODS`);
        }
    },
    getBotStatus(client, channel, user, message, store) {
        if (message === "!botshu status") {
            if (store.isBotEnabled()) {
                client.say(channel, `BotShu is enabled BIGMUSHU`);
            } else {
                client.say(channel, `BotShu is sleeping mushuBlankie`);
            }
        }
    },
};

module.exports = {
    /**
     * Run commands that should be available only to moderators and the
     * broadcaster, related to the global enable/disable of the bot. Receives
     * the parameters given by Tmi.js message event.
     * @param {Object} client Tmi.js client.
     * @param {string} channel Channel name.
     * @param {Object} user Userstate object.
     * @param {string} message Message received.
     * @param {Object} store Bot state.
     */
    runEnableDisableCommands(client, channel, user, message, store) {
        Object.values(enableDisableCommands).map((value) => {
            if (typeof value === "function") {
                value(client, channel, user, message, store);
            }
        });
    },
};
