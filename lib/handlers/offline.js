// Message handlers for when the stream is offline

const throttle = require("lodash.throttle");
const OFFLINE_COOLDOWN = 15;

const offlineHandlers = {
    promoteVideo(p) {
        sendOfflineMessage(p);
    },
};

var sendOfflineMessage = throttle(
    (p) =>
        p.client.say(
            p.channel,
            `Hello @${p.user["display-name"]} mushuWave the stream is currently 
            offline. ${p.store.getOfflineMessage()}`
        ),
    OFFLINE_COOLDOWN * 1000
);

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
