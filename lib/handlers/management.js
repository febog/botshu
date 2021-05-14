// Commands only available to moderators and the broadcaster

const managementHandlers = {
    resetAllStrikes(p) {
        if (p.message === "!botshu reset all") {
            p.store.resetAllStrikes();
            p.client.say(p.channel, `Strikes have been reset`);
        }
    },
    resetUserStrikes(p) {
        if (p.message.startsWith("!botshu reset")) {
            // Remove "!botshu reset" from the message and get the words
            const args = p.message.slice(14).split(" ");
            // Get the name if given after the word "reset"
            const firstArg = args.shift().toLowerCase();
            if (firstArg === "all") return; // Ignore "all" as username
            if (p.store.userHasStrikes(firstArg)) {
                // User found, reset their strikes
                if (p.store.removeUserStrikes(firstArg)) {
                    // The username existed and has been removed
                    p.client.say(
                        p.channel,
                        `Strikes have been reset for ${firstArg}`
                    );
                }
            } else {
                // Username not found
                p.client.say(p.channel, `Username "${firstArg}" not found`);
            }
        }
    },
    getUserCount(p) {
        if (p.message.startsWith("!botshu count")) {
            // Remove "!botshu count" from the message and get the words
            const args = p.message.slice(14).split(" ");
            // Get the name if given after the word "count"
            const firstArg = args.shift().toLowerCase();
            if (p.store.userHasStrikes(firstArg)) {
                // User found, print their strkes
                let strikeCount = p.store.getUserStrikes(firstArg);
                p.client.say(p.channel, `@${firstArg} has ${strikeCount} strikes`);
            } else {
                // Username not found
                p.client.say(p.channel, `@${firstArg} has no strikes`);
            }
        }
    },
    sayHelloToMods(p) {
        if (p.message === "@ModShu hi") {
            if (p.user.username === "febog") {
                p.client.say(p.channel, `Fuck you Felipe peepoGiggles`);
            } else {
                p.client.say(p.channel, `Hello ${p.user["display-name"]} popCat`);
            }
        }
    },
};

module.exports = {
    /**
     * Handlers available only to moderators and the broadcaster.
     * @param {Object} p Message handler parameter object.
     */
    handleManagementMessage(p) {
        Object.values(managementHandlers).map((value) => {
            if (typeof value === "function") {
                value(p);
            }
        });
    },
};
