const ChatMessageHandler = require('../chat-message-handler.js');

const {
    BOTSHU_ENABLE_COMMAND,
    BOTSHU_DISABLE_COMMAND,
    BOTSHU_STATUS_COMMAND,
} = require('../commands.js');

const enableDisableHandlers = [
    async function enableBot(p) {
        if (p.message === BOTSHU_ENABLE_COMMAND) {
            await p.store.enableBot();
            p.client.say(p.channel, 'BotShu is now enabled mushuHi');
        }
    },
    function disableBot(p) {
        if (p.message === BOTSHU_DISABLE_COMMAND) {
            p.store.disableBot();
            p.client.say(p.channel, 'BotShu is now disabled PETTHEMODS');
        }
    },
    function getBotStatus(p) {
        if (p.message === BOTSHU_STATUS_COMMAND) {
            p.client.say(
                p.channel,
                `Hello ${p.msg.userInfo.displayName}, BotShu is 
                    ${p.store.isBotEnabled()
                    ? "enabled BIGMUSHU "
                    : "sleeping mushuBlankie "
                }. The stream is currently ${p.store.isStreamLive() ? "Live" : "Offline"
                }. Running BotShu version ${process.env.npm_package_version}`
            );
        }
    },
];

/**
 * Commands that globally enable and disable the chat bot functionality.
 */
module.exports = class EnableDisableHandler extends ChatMessageHandler {
    constructor() {
        super(enableDisableHandlers);
    }
};
