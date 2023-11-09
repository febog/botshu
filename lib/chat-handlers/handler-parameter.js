module.exports = class HandlerParameter {
    /**
     * Set all the parameters needed to handle a message received by the bot.
     * @param {Object} chatClient Twurple chat client.
     * @param {Object} apiClient Twurple API client.
     * @param {Object} io socket.io.
     * @param {string} channel Channel name.
     * @param {string} user Sender username.
     * @param {string} message Message received text.
     * @param {Object} msg Twurple's full message object containing all message and user information.
     * @param {Object} store Bot state.
     */
    constructor(chatClient, apiClient, io, channel, user, message, store, msg) {
        this.client = chatClient;
        this.apiClient = apiClient;
        this.io = io;
        this.channel = channel;
        this.user = user;
        this.message = message;
        this.msg = msg;
        this.store = store;

        // Remove extra whitespace and get words in the message as an array
        this.words = message.replace(/\s+/g, " ").trim().split(" ");
    }

    hasBotPrefix() {
        this.words[0] === this.store.botPrefix;
    }
};
