// Commands only available to moderators and the broadcaster. Related to the bot
// global enable or disable status.

const enableDisableHandlers = {
    enableBot(p) {
        if (p.message.startsWith(p.store.prefix + "enable")) {
            p.store.enableBot();
            p.client.say(p.channel, `BotShu is now enabled mushuHi`);
        }
    },
    disableBot(p) {
        if (p.message.startsWith(p.store.prefix + "disable")) {
            p.store.disableBot();
            p.client.say(p.channel, `BotShu is now disabled PETTHEMODS`);
        }
    },
    getBotStatus(p) {
        if (p.message.startsWith(p.store.prefix + "status")) {
            p.store.isBotEnabled()
                ? p.client.say(p.channel, `BotShu is enabled BIGMUSHU`)
                : p.client.say(p.channel, `BotShu is sleeping mushuBlankie`);
        }
    },
};

module.exports = {
    /**
     * Handlers for enabling and disabling the bot. Only available to moderators
     * and the broadcaster.
     * @param {Object} p Message handler parameter object.
     */
    handleEnableDisableMessage(p) {
        Object.values(enableDisableHandlers).map((value) => {
            if (typeof value === "function") {
                value(p);
            }
        });
    },
};
