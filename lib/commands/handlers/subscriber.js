// Message handlers for subs only

const subHandlers = {
    async vanish(p) {
        if (p.message === "!vanish" && !p.msg.userInfo.isMod) {
            // Timeout 1 second1
            const timeoutDetails = {
                user: p.msg.userInfo.userId,
                reason: "BotShu: Timeout via !vanish command",
                duration: 5,
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
     * Handlers that should be available to everyone.
     * @param {Object} p Message handler parameter object.
     */
    handleSubscriberMessage(p) {
        Object.values(subHandlers).map((value) => {
            if (typeof value === "function") {
                value(p);
            }
        });
    },
};
