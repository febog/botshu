const ChatMessageHandler = require("../chat-message-handler.js");

const {
    SET_OFFLINE_MESSAGE_COMMAND
} = require("../commands.js");

const offlineMessageManagementHandlers = [
    function setOfflineMessage(p) {
        if (p.message.startsWith(SET_OFFLINE_MESSAGE_COMMAND)) {
            const msg = p.message.slice(19);
            p.store.setOfflineMessage(msg);
            p.client.say(p.channel, `Offline message set to: ${msg}`);
        }
    },
];

/**
 * For managing the offline message content.
 */
module.exports = class OfflineMessageManagementHandler extends ChatMessageHandler {
    constructor() {
        super(offlineMessageManagementHandlers);
    }
};
