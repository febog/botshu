// Public handlers PepeLaugh

const features = require("../common/features.js");

// Sleep time in seconds.
const OOOO_SLEEP_TIME = 5;
const CUSTOM_COMMANDS_SLEEP_TIME = 1;

var ooooSleeping = false;
var customCommandsSleeping = false;

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
    giveCandy(p) {
        if (!features.CANDY_COMMAND_ENABLED) return;
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
        if (
            p.store.isGivingCandy() &&
            p.message.toLowerCase().startsWith("@modshu give candy to ")
        ) {
            // Get first word after command
            let param = p.message.slice(22).split(" ").shift();
            p.client.say(
                p.channel,
                `${param}, you got some candy from ${p.user["display-name"]} widepeepoHappy / 🍬`
            );
        }
    },
    handleCustomCommand(p) {
        if (p.store.isCustomCommand(p.words[0]) && !customCommandsSleeping) {
            let msg = p.store.getCustomCommand(p.words[0]);
            p.client.say(p.channel, msg);
            customCommandsSleeping = true;
            setTimeout(
                () => (customCommandsSleeping = false),
                CUSTOM_COMMANDS_SLEEP_TIME * 1000
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
