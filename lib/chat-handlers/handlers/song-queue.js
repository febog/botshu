const ChatMessageHandler = require('../chat-message-handler.js');

const songQueueHandlers = [
    function handleSongQueue(p) {
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
];

/**
 * Detects when a new song is requested and adds it to the queue.
 */
module.exports = class SongQueueHandler extends ChatMessageHandler {
    constructor() {
        super(songQueueHandlers);
    }
};
