// Logic for updating the song queue

const songQueueHandlers = {
    handleSongQueue(p) {
        const songAddedRegex = /\w+#\d\d\d\d\b/;
        if (songAddedRegex.test(p.message)) {
            // Song added message detected
            p.store.getSongQueue().push(p.message);
        }
    },
};

module.exports = {
    /**
     * Handlers available only to moderators and the broadcaster.
     * @param {Object} p Message handler parameter object.
     */
    handleSongQueueMessage(p) {
        Object.values(songQueueHandlers).map((value) => {
            if (typeof value === "function") {
                value(p);
            }
        });
    },
};
