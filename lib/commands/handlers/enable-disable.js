// Commands only available to moderators and the broadcaster. Related to the bot
// global enable or disable status.

const enableDisableHandlers = {
    async enableBot(p) {
        if (p.words[1] === "enable") {
            await p.store.enableBot();
            p.client.say(p.channel, `BotShu is now enabled mushuHi`);
        }
    },
    disableBot(p) {
        if (p.words[1] === "disable") {
            p.store.disableBot();
            p.client.say(p.channel, `BotShu is now disabled PETTHEMODS`);
        }
    },
    getBotStatus(p) {
        if (p.words[1] === "status") {
            p.client.say(
                p.channel,
                `Hello ${p.msg.userInfo.displayName}, Botshu is 
                    ${
                        p.store.isBotEnabled()
                            ? "enabled BIGMUSHU "
                            : "sleeping mushuBlankie "
                    }. The stream is currently ${
                    p.store.isStreamLive() ? "Live" : "Offline"
                }. Running BotShu version ${process.env.npm_package_version}`
            );
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
            if (typeof value === "function" && p.hasBotPrefix()) {
                value(p);
            }
        });
    },
};
