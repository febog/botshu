// Message handlers for non-subs only

const nonSubHandlers = {
    stopDiscordTag(p) {
        let discordTagRegex = /\w+#\d\d\d\d\b/;
        if (discordTagRegex.test(p.message)) {
            // Message contains a Discord tag
            p.client.timeout(
                p.channel,
                p.user.username,
                10, // Timeout 10 seconds
                "Discord tag found in message"
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
