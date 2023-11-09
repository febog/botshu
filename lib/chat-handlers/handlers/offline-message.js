const ChatMessageHandler = require("../chat-message-handler.js");

// Offline chat 30 min cooldown
const COOLDOWN = 1800; // Seconds;

var offlineMessageSleeping = false;

const offlineMessageHandlers = [
    function promoteVideo(p) {
        if (!offlineMessageSleeping) {
            p.client.say(
                p.channel,
                `Hello @${p.msg.userInfo.displayName
                } mushuHi The stream is currently
                offline. ${p.store.getOfflineMessage()}`
            );
            offlineMessageSleeping = true;
            setTimeout(() => (offlineMessageSleeping = false), COOLDOWN * 1000);
        }
    },
];

/**
 * If enabled, prints an offline message with a certain cooldown.
 */
module.exports = class OfflineMessageHandler extends ChatMessageHandler {
    constructor() {
        super(offlineMessageHandlers);
    }
};
