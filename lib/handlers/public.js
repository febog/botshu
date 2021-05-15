// Public handlers PepeLaugh

const OOOO_COOLDOWN_FLAG = "oooo_cooldown_flag";
const OOOO_COOLDOWN = 2;

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
            if (!p.store.hasCooldownFlag(OOOO_COOLDOWN_FLAG)) {
                p.store.addCooldownFlag(OOOO_COOLDOWN_FLAG);
                setTimeout(() => {
                    p.store.clearCooldownFlag(OOOO_COOLDOWN_FLAG);
                }, OOOO_COOLDOWN * 1000);
                p.client.say(p.channel, `OOOO`);
            }
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
