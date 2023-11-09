const ChatMessageHandler = require("../chat-message-handler.js");

const {
    BOTSHU_VERSION_COMMAND,
} = require("../commands.js");

const versionHandlers = [
    function printVersion(p) {
        if (p.message === BOTSHU_VERSION_COMMAND) {
            p.client.say(
                p.channel,
                `BotShu version ${process.env.npm_package_version}`
            );
        }
    },
];

/**
 * Prints the bot version.
 */
module.exports = class VersionHandler extends ChatMessageHandler {
    constructor() {
        super(versionHandlers);
    }
};
