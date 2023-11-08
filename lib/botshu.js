/**
 * Main application state.
 */

const ApiClient = require("./adapters/api-client.js");
const ChatClient = require("./adapters/chat-client.js");

module.exports = class BotShu {
    constructor(chatClient, apiClient, socketio, storage, store) {
        this.chatClient = new ChatClient(chatClient);
        this.apiClient = new ApiClient(apiClient);
        this.io = socketio;
        this.storage = storage;
        this.store = store;
    }

    initializeBotState() {
        if (this.apiClient.isMushuStreamOnline()) {
            store.setStreamLive();
        } else {
            store.setStreamOffline();
        }
    }
};
