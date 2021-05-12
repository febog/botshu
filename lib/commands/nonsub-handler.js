// Message handlers for non-subs only

const nonSubMessageHandlers = {
    stopDiscordTag(client, channel, user, message, store) {
        let discordTagRegex = /\w+#\d\d\d\d/;
        if (discordTagRegex.test(message)) {
            // Message contains a Discord tag
            client.timeout(
                channel,
                user.username,
                10, // Timeout 10 seconds
                "Discord tag found in message"
            );
        }
    },
};

module.exports = {
    /**
     * Commands available to everyone. Receives the parameters given by Tmi.js
     * message event.
     * @param {Object} client Tmi.js client.
     * @param {string} channel Channel name.
     * @param {Object} user Userstate object.
     * @param {string} message Message received.
     * @param {Object} store Bot state.
     */
    handleNonSubMessages(client, channel, user, message, store) {
        Object.values(nonSubMessageHandlers).map((value) => {
            if (typeof value === "function") {
                value(client, channel, user, message, store);
            }
        });
    },
};
