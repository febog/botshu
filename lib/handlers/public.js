// Public handlers PepeLaugh

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
        if (p.message.toLowerCase().startsWith("!goals") && !goalsSleeping) {
            p.client.say(p.channel, `mushuSmug Full list of rewards here https://bit.ly/2ZKfAbF`);
            goalsSleeping = true;
            setTimeout(() => (goalsSleeping = false), GOALS_SLEEP_TIME * 1000);
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
