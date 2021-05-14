// Public commands PepeLaugh

const publicCommands = {
    engMushuEasterEgg(client, channel, user, message, store) {
        if (message === "!eng Mushu" || message === "!eng @Mushu") {
            client.say(
                channel,
                `@${user.username} Trying to !eng Mushu, I see PepeMods`
            );
        }
    },
    engOoooEasterEgg(client, channel, user, message, store) {
        if (message === "OOOO") {
            client.say(channel, `OOOO`);
        }
    },
    stopDiscordTag(client, channel, user, message, store) {
        // Only for non-subs. TODO: Move non-subs to another file
        if (user.subscriber) return;
        let discordTagRegex = /\w+#\d\d\d\d/;
        if (discordTagRegex.test(message)) {
            // Message contains a Discord tag
            client.timeout(
                channel,
                user.username,
                10, // Timeout 600 seconds
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
    runPublicCommands(client, channel, user, message, store) {
        Object.values(publicCommands).map((value) => {
            if (typeof value === "function") {
                value(client, channel, user, message, store);
            }
        });
    },
};
