// Message handlers for when the stream is offline

// Offline chat 30 min cooldown
const COOLDOWN = 1800; // Seconds;

var offlineMessageSleeping = false;

const offlineHandlers = {
    promoteVideo(p) {
        if (!offlineMessageSleeping) {
            p.client.say(
                p.channel,
                `Hello @${
                    p.msg.userInfo.displayName
                } mushuHi The stream is currently
                    offline. ${p.store.getOfflineMessage()}`
            );
            offlineMessageSleeping = true;
            setTimeout(() => (offlineMessageSleeping = false), COOLDOWN * 1000);
        }
    },
};

module.exports = {
    /**
     * Handlers available when the stream is offline
     * @param {Object} p Message handler parameter object.
     */
    handleOfflineMessage(p) {
        Object.values(offlineHandlers).map((value) => {
            if (typeof value === "function") {
                value(p);
            }
        });
    },
};
