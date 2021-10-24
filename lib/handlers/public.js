// Public handlers PepeLaugh

const features = require("./features.js");

// Sleep time in seconds.
const OOOO_SLEEP_TIME = 5;
const GOALS_SLEEP_TIME = 30;

var ooooSleeping = false;
var goalsSleeping = false;

const publicHandlers = {
    engMushuEasterEgg(p) {
        if (
            p.message.startsWith("!eng Mushu") ||
            p.message.startsWith("!eng @Mushu")
        ) {
            p.client.say(
                p.channel,
                `@${p.user["display-name"]} Trying to !eng Mushu, I see PepeMods`
            );
        }
    },
    engOoooEasterEgg(p) {
        if (p.message === "OOOO" && !ooooSleeping) {
            p.client.say(p.channel, `OOOO`);
            ooooSleeping = true;
            setTimeout(() => (ooooSleeping = false), OOOO_SLEEP_TIME * 1000);
        }
    },
    goalsSubathon(p) {
        if (
            features.GOALS_COMMAND_ENABLED &&
            p.message.toLowerCase().startsWith("!goals") &&
            !goalsSleeping
        ) {
            let msg =
                p.store.getGoalsMessage() === ""
                    ? `mushuSmug Full list of rewards`
                    : p.store.getGoalsMessage();
            p.client.say(p.channel, msg);
            goalsSleeping = true;
            setTimeout(() => (goalsSleeping = false), GOALS_SLEEP_TIME * 1000);
        }
    },
    giveCandy(p) {
        if (
            p.store.isGivingCandy() &&
            p.message.toLowerCase().startsWith("@modshu candy please")
        ) {
            p.client.say(
                p.channel,
                `widepeepoHappy / 🍬 for you @${p.user["display-name"]}`
            );
        }
        if (
            p.store.isGivingCandy() &&
            p.message.toLowerCase().startsWith("@modshu trick or treat")
        ) {
            p.client.say(
                p.channel,
                `monkaW / 🍫 for you @${p.user["display-name"]}`
            );
        }
    },
};

module.exports = {
    /**
     * Handlers that should be available to everyone.
     * @param {Object} p Message handler parameter object.
     */
    handlePublicMessage(p) {
        Object.values(publicHandlers).map((value) => {
            if (typeof value === "function") {
                value(p);
            }
        });
    },
};
