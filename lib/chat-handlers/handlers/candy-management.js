const ChatMessageHandler = require("../chat-message-handler.js");

const candyManagementHandlers = [
    function handleCandyStatus(p) {
        switch (p.words[1]) {
            case "givecandy":
                p.store.setGivingCandy(true);
                p.client.say(
                    p.channel,
                    "Ok, I will give some candy widepeepoHappy"
                );
                break;

            case "stopcandy":
                p.store.setGivingCandy(false);
                p.client.say(
                    p.channel,
                    "Sounds good widepeepoHappy I will stop giving candy"
                );
                break;

            default:
                break;
        }
    },
];

/**
 * Manage if the bot is giving candy.
 */
module.exports = class CandyManagementHandler extends ChatMessageHandler {
    constructor() {
        super(candyManagementHandlers);
    }
};
