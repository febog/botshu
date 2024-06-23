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
    // Initial heist calculator implementation using existing infra
    function heistCalculator(p) {
        if (
            p.message.startsWith("!heistcalc") &&
            p.words[1] !== undefined &&
            p.words[2] !== undefined
        ) {
            // All parameters for !heistcalc are present
            // i.e. the message is of the form `!heistcalc param1 param2`
            // Heist calculator logic, move this to its own place later
            const current = Number(p.words[1]);
            const goal = Number(p.words[2]);
            const earningsNeeded = goal - current;
            const maxBalanceIfWin = current * 1.45;
            const heistNeeded = earningsNeeded / 0.45;
            if (goal <= current) {
                p.client.say(
                    p.channel,
                    `Error: Goal must be higher than current balance Suskayge`
                );
                return;
            }
            if (goal > maxBalanceIfWin) {
                p.client.say(
                    p.channel,
                    `Error: Goal is too high Sadge`
                );
            } else {
                p.client.say(
                    p.channel,
                    `Use !heist ${Math.round(heistNeeded)} ${p.msg.userInfo.displayName}`
                );
            }
        } else if (
            p.message.startsWith("!heistcalc")
        ) {
            p.client.say(
                p.channel,
                `Type !heistcalc <your current number of points> <desired goal> ${p.msg.userInfo.displayName}`
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
