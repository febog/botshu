// Public handlers PepeLaugh

// Sleep time in seconds.
const SLEEP_TIME = 5;

var ooooSleeping = false;

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
            setTimeout(() => (ooooSleeping = false), SLEEP_TIME * 1000);
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
