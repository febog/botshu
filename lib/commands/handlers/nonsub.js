// Message handlers for non-subs only

const nonSubHandlers = {
    async stopDiscordTag(p) {
        let discordTagRegex = /\w+#\d\d\d\d\b/;
        if (discordTagRegex.test(p.message)) {
            // Message contains a Discord tag
            const timeoutDetails = {
                user: p.msg.userInfo.userId,
                reason: "Discord tag found in message",
                duration: 10, // Timeout 10 seconds
            };
            await p.apiClient.moderation.banUser(
                p.msg.channelId,
                process.env.TWITCH_USER_ID_MODSHU,
                timeoutDetails
            );
        }
    },
};

module.exports = {
    /**
     * Handlers available for non-subs only.
     * @param {Object} p Message handler parameter object.
     */
    handleNonSubMessage(p) {
        Object.values(nonSubHandlers).map((value) => {
            if (typeof value === "function") {
                value(p);
            }
        });
    },
};
