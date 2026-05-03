const ChatMessageHandler = require("../chat-message-handler.js");

const {
    VANISH_COMMAND,
} = require("../commands.js");

const vanishHandlers = [
    async function vanish(p) {
        if (p.message === VANISH_COMMAND && !p.msg.userInfo.isMod) {
            const timeoutDetails = {
                user: p.msg.userInfo.userId,
                reason: "[BotShu] Timeout via !vanish command",
                duration: 5, // Timeout in seconds
            };
            await p.apiClient.asUser(process.env.TWITCH_USER_ID_MODSHU, async ctx => {
                await ctx.moderation.banUser(
                    p.msg.channelId,
                    timeoutDetails
                );
            });
        }
    },
];

/**
 * Implements the !vanish command.
 */
module.exports = class VanishHandler extends ChatMessageHandler {
    constructor() {
        super(vanishHandlers);
    }
};
