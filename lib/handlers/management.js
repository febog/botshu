// Commands only available to moderators and the broadcaster

const managementHandlers = {
    resetUserStrikes(p) {
        if (p.words[1] === "reset") {
            // Remove "!botshu reset" from the message and get the words
            const args = p.message.slice(14).split(" ");
            // Get the name if given after the word "reset"
            const firstArg = args.shift().toLowerCase();
            if (firstArg === "all") {
                p.store.resetAllStrikes();
                p.client.say(p.channel, `Strikes have been reset`);
                return;
            }
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
        if (p.words[1] === "count") {
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
        switch (p.words[1]) {
            case "stream":
                sayStreamStaus(p);
                break;

            case "golive":
                p.store.setStreamLive();
                sayStreamStaus(p);
                break;

            case "gooffline":
                p.store.setStreamOffline();
                sayStreamStaus(p);
                break;

            default:
                break;
        }
    },
    setOfflineMessage(p) {
        if (p.words[1] === "setmessage") {
            const msg = p.message.slice(19);
            p.store.setOfflineMessage(msg);
            p.client.say(p.channel, `Offline message set to: ${msg}`);
        }
    },
    setGoalsMessage(p) {
        if (p.words[1] === "setgoals") {
            const msg = p.message.slice(17);
            p.store.setGoalsMessage(msg);
            p.client.say(p.channel, `Goals message set to: ${msg}`);
        }
    },
    getVersion(p) {
        if (p.words[1] === "version") {
            p.client.say(
                p.channel,
                `BotShu version ${p.store.getBotVersion()}`
            );
        }
    },
    handleCandyStatus(p) {
        switch (p.words[1]) {
            case "givecandy":
                p.store.setGivingCandy(true);
                p.client.say(
                    p.channel,
                    `Ok, I will give some candy widepeepoHappy`
                );
                break;

            case "stopcandy":
                p.store.setGivingCandy(false);
                p.client.say(
                    p.channel,
                    `Sounds good widepeepoHappy I will stop giving candy`
                );
                break;

            default:
                break;
        }
    },
};

function sayStreamStaus(p) {
    p.client.say(
        p.channel,
        `Stream status is ${p.store.isStreamLive() ? "Live" : "Offline"}`
    );
}

module.exports = {
    /**
     * Handlers available only to moderators and the broadcaster.
     * @param {Object} p Message handler parameter object.
     */
    handleManagementMessage(p) {
        Object.values(managementHandlers).map((value) => {
            if (typeof value === "function" && p.hasBotPrefix()) {
                value(p);
            }
        });
    },
};
