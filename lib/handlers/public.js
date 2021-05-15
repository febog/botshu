// Public handlers PepeLaugh

const throttle = require("lodash.throttle");

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
        if (p.message === "OOOO") {
            sendOooo(p);
        }
    },
};

var sendOooo = throttle((p) => p.client.say(p.channel, `OOOO`), 3000);

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
