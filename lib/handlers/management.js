// Commands only available to moderators and the broadcaster

const managementHandlers = {
    resetAllStrikes(p) {
        if (p.message.startsWith(p.store.prefix + "reset all")) {
            p.store.resetAllStrikes();
            p.client.say(p.channel, `Strikes have been reset`);
        }
    },
    resetUserStrikes(p) {
        if (p.message.startsWith(p.store.prefix + "reset")) {
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
        if (p.message.startsWith(p.store.prefix + "count")) {
            // Remove "!botshu count" from the message and get the words
            const args = p.message.slice(14).split(" ");
            // Get the name if given after the word "count"
            const firstArg = args.shift().toLowerCase();
            if (p.store.userHasStrikes(firstArg)) {
                // User found, print their strkes
                let strikeCount = p.store.getUserStrikes(firstArg);
                p.client.say(
                    p.channel,
                    `@${firstArg} has ${strikeCount} strikes`
                );
            } else {
                // Username not found
                p.client.say(p.channel, `@${firstArg} has no strikes`);
            }
        }
    },
    handleStreamStatus(p) {
        if (p.message.startsWith(p.store.prefix + "golive")) {
            p.store.setStreamLive();
        }
        if (p.message.startsWith(p.store.prefix + "streamoffline")) {
            p.store.setStreamOffline();
        }
        if (p.message.startsWith(p.store.prefix + "stream")) {
            p.client.say(
                p.channel,
                `Stream status is ${
                    p.store.isStreamLive() ? "Live" : "Offline"
                }`
            );
        }
    },
    sayHelloToMods(p) {
        if (p.message.startsWith("@ModShu hi")) {
            if (p.user.username === "febog") {
                p.client.say(p.channel, `Fuck you Felipe peepoGiggles`);
            } else {
                p.client.say(
                    p.channel,
                    `Hello ${p.user["display-name"]} popCat`
                );
            }
        }
    },
    setOfflineMessage(p) {
        if (p.message.startsWith(p.store.prefix + "setmessage")) {
            const msg = p.message.slice(19);
            p.store.setOfflineMessage(msg);
            p.client.say(p.channel, `Offline message set to: ${msg}`);
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
