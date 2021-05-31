// Message handlers for when the stream is offline

const throttle = require("lodash.throttle");
const OFFLINE_COOLDOWN = 300;

const offlineHandlers = {
    promoteVideo(p) {
        // Store a copy of the name and use that for when the throttled function
        // eventually executes
        let user = p.user["display-name"].slice();
        sendOfflineMessage(p, user);
    },
};

var sendOfflineMessage = throttle((p, user) => {
    // Don't print offline message if stream is live
    if (p.store.isStreamLive()) return;
    p.client.say(
        p.channel,
        `Hello @${user} mushHii The stream is currently
            offline. ${p.store.getOfflineMessage()}`
    );
}, OFFLINE_COOLDOWN * 1000);

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
