const ChatMessageHandler = require("../chat-message-handler.js");

const {
    CUSTOM_COMMAND_SET_COMMAND,
    CUSTOM_COMMAND_DELETE_COMMAND,
} = require("../commands.js");

const customCommandsManagementHandlers = [
    function handleCustomCommands(p) {
        if (
            p.message.startsWith(CUSTOM_COMMAND_SET_COMMAND) &&
            p.words[2] !== undefined &&
            p.words[3] !== undefined
        ) {
            // All parameters for addcommand are present
            const response = p.words.slice(3).join(" ");
            p.store.setCustomCommand(p.words[2], response);
            p.client.say(
                p.channel,
                `Created command "${p.words[2]}" with response: ${response}`
            );
        }
        if (p.message.startsWith(CUSTOM_COMMAND_DELETE_COMMAND) &&
            p.words[2] !== undefined) {
            // All parameters for deletecommand are present
            p.store.deleteCustomCommand(p.words[2]);
            p.client.say(p.channel, `Deleted command "${p.words[2]}"`);
        }
    },
];

/**
 * Custom commands management.
 */
module.exports = class CustomCommandsManagementHandler extends ChatMessageHandler {
    constructor() {
        super(customCommandsManagementHandlers);
    }
};
