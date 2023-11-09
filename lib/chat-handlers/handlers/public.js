const ChatMessageHandler = require("../chat-message-handler.js");

// Cooldown time in seconds for some commands.
const OOOO_SLEEP_TIME = 5;

var ooooSleeping = false;

const publicHandlers = [
    function engMushuEasterEgg(p) {
        if (
            p.message.startsWith("!eng Mushu") ||
            p.message.startsWith("!eng @Mushu")
        ) {
            p.client.say(
                p.channel,
                `@${p.msg.userInfo.displayName} Trying to !eng Mushu, I see PepeMods`
            );
        }
    },
    function engOoooEasterEgg(p) {
        if (p.message === "OOOO" && !ooooSleeping) {
            p.client.say(p.channel, "OOOO");
            ooooSleeping = true;
            setTimeout(() => (ooooSleeping = false), OOOO_SLEEP_TIME * 1000);
        }
    },
    function giveCandy(p) {
        if (
            p.store.isGivingCandy() &&
            p.message.toLowerCase().startsWith("@modshu candy please")
        ) {
            p.client.say(
                p.channel,
                `widepeepoHappy / 🍬 for you @${p.msg.userInfo.displayName}`
            );
        }
        if (
            p.store.isGivingCandy() &&
            p.message.toLowerCase().startsWith("@modshu trick or treat")
        ) {
            p.client.say(
                p.channel,
                `monkaW / 🍫 for you @${p.msg.userInfo.displayName}`
            );
        }
        if (
            p.store.isGivingCandy() &&
            p.message.toLowerCase().startsWith("@modshu give candy to ")
        ) {
            // Get first word after command
            const param = p.message.slice(22).split(" ").shift();
            p.client.say(
                p.channel,
                `${param}, you got some candy from ${p.msg.userInfo.displayName} widepeepoHappy / 🍬`
            );
        }
    },
];

/**
 * Miscellaneous commands that everyone can use.
 */
module.exports = class PublicHandler extends ChatMessageHandler {
    constructor() {
        super(publicHandlers);
    }
};
