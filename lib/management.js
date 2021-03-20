// Commands only available to moderators and the broadcaster

const managementCommands = {
    resetAllStrikes(client, channel, user, message, store) {
        if (message === "!botshu reset all") {
            store.resetAllStrikes();
            client.say(channel, `Strikes have been reset`);
        }
    },
    resetUserStrikes(client, channel, user, message, store) {
        if (message.startsWith("!botshu reset")) {
            // Remove "!botshu reset" from the message and get the words
            const args = message.slice(14).split(" ");
            // Get the name if given after the word "reset"
            const firstArg = args.shift().toLowerCase();
            if (firstArg === "all") return; // Ignore "all" as username
            if (store.userHasStrikes(firstArg)) {
                // User found, reset their strikes
                if (store.removeUserStrikes(firstArg)) {
                    // The username existed and has been removed
                    client.say(
                        channel,
                        `Strikes have been reset for ${firstArg}`
                    );
                }
            } else {
                // Username not found
                client.say(channel, `Username "${firstArg}" not found`);
            }
        }
    },
    getUserCount(client, channel, user, message, store) {
        if (message.startsWith("!botshu count")) {
            // Remove "!botshu count" from the message and get the words
            const args = message.slice(14).split(" ");
            // Get the name if given after the word "count"
            const firstArg = args.shift().toLowerCase();
            if (store.userHasStrikes(firstArg)) {
                // User found, print their strkes
                let strikeCount = store.getUserStrikes(firstArg);
                client.say(channel, `@${firstArg} has ${strikeCount} strikes`);
            } else {
                // Username not found
                client.say(channel, `Username "${firstArg}" has no strikes`);
            }
        }
    },
};

module.exports = {
    /**
     * Run commands that should be available only to moderators and the
     * broadcaster. Receives the parameters given by Tmi.js message event.
     * @param {Object} client Tmi.js client.
     * @param {string} channel Channel name.
     * @param {Object} user Userstate object.
     * @param {string} message Message received.
     * @param {ObjectConstructor} store Bot state.
     */
    runManagementCommands(client, channel, user, message, store) {
        Object.values(managementCommands).map((value) => {
            if (typeof value === "function") {
                value(client, channel, user, message, store);
            }
        });
    },
};
