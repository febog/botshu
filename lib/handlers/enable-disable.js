// Commands only available to moderators and the broadcaster. Related to the bot
// global enable or disable status.

const enableDisableHandlers = {
    enableBot(p) {
        if (!p.store.isBotEnabled() && p.message === "!botshu enable") {
            p.store.enableBot();
            p.client.say(p.channel, `BotShu is now enabled mushHii`);
        }
    },
    disableBot(p) {
        if (p.store.isBotEnabled() && p.message === "!botshu disable") {
            p.store.disableBot();
            p.client.say(p.channel, `BotShu is now disabled PETTHEMODS`);
        }
    },
    getBotStatus(p) {
        if (p.message === "!botshu status") {
            if (p.store.isBotEnabled()) {
                p.client.say(p.channel, `BotShu is enabled BIGMUSHU`);
            } else {
                p.client.say(p.channel, `BotShu is sleeping mushuBlankie`);
            }
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
