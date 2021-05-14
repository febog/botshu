// Message handlers for when the stream is offline

const offlineHandlers = {
    promoteVideo(p) {
        p.client.say(
            p.channel,
            `@${p.user["display-name"]} the stream is offline.`
        );
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
