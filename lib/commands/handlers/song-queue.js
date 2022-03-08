// Logic for updating the song queue

const songQueueHandlers = {
    handleSongQueue(p) {
        const songAddedRegex =
            /(.+) --> The song (.+) has been added to the queue\./;
        const match = p.message.match(songAddedRegex);
        if (match) {
            // Song added message detected
            p.store
                .getSongQueue()
                .push({ name: match[2], requestor: match[1] });
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