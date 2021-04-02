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
