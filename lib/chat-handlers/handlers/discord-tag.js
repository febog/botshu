const ChatMessageHandler = require("../chat-message-handler.js");

const discordTagHandlers = [
    async function stopDiscordTag(p) {
        const discordTagRegex = /\w+#\d\d\d\d\b/;
        if (discordTagRegex.test(p.message)) {
            // Message contains a Discord tag
            const timeoutDetails = {
                user: p.msg.userInfo.userId,
                reason: "[BotShu] Discord tag found in message",
                duration: 10, // Timeout 10 seconds
            };
            await p.apiClient.moderation.banUser(
                p.msg.channelId,
                process.env.TWITCH_USER_ID_MODSHU,
                timeoutDetails
            );
        }
    },
];

/**
 * Used for timing out bots that spam Discord tags. Detects these using regex.
 */
module.exports = class DiscordTagHandler extends ChatMessageHandler {
    constructor() {
        super(discordTagHandlers);
    }
};
