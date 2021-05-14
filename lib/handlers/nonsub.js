// Message handlers for non-subs only

const nonSubMessageHandlers = {
    stopDiscordTag(p) {
        let discordTagRegex = /\w+#\d\d\d\d/;
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
     * Commands available non-subs only.
     * @param {Object} p Message handler parameter object.
     */
    handleNonSubMessages(p) {
        Object.values(nonSubMessageHandlers).map((value) => {
            if (typeof value === "function") {
                value(p);
            }
        });
    },
};
