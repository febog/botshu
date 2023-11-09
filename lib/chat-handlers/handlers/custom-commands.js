const ChatMessageHandler = require("../chat-message-handler.js");

// Cooldown time in seconds for some commands.
const CUSTOM_COMMANDS_SLEEP_TIME = 1;

var customCommandsSleeping = false;

const customCommandsHandlers = [
    function handleCustomCommand(p) {
        if (p.store.isCustomCommand(p.words[0]) && !customCommandsSleeping) {
            const msg = p.store.getCustomCommand(p.words[0]);
            p.client.say(p.channel, msg);
            customCommandsSleeping = true;
            setTimeout(
                () => (customCommandsSleeping = false),
                CUSTOM_COMMANDS_SLEEP_TIME * 1000
            );
        }
    },
];

/**
 * Custom commands handler
 */
module.exports = class CustomCommandsHandler extends ChatMessageHandler {
    constructor() {
        super(customCommandsHandlers);
    }
};
