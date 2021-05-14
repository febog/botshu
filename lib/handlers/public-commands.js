// Public handlers PepeLaugh

const publicHandlers = {
    engMushuEasterEgg(p) {
        if (p.message === "!eng Mushu" || p.message === "!eng @Mushu") {
            p.client.say(
                p.channel,
                `@${p.user.username} Trying to !eng Mushu, I see PepeMods`
            );
        }
    },
    engOoooEasterEgg(p) {
        if (p.message === "OOOO") {
            p.client.say(p.channel, `OOOO`);
        }
    },
};

module.exports = {
    /**
     * Handlers that should be available to everyone.
     * @param {Object} p Message handler parameter object.
     */
    runPublicHandlers(p) {
        Object.values(publicHandlers).map((value) => {
            if (typeof value === "function") {
                value(p);
            }
        });
    },
};
