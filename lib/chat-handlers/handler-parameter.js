module.exports = class HandlerParameter {
    /**
     * Set all the parameters needed to handle a message received by the bot.
     * @param {Object} client Twurple chat client.
     * @param {Object} apiClient Twurple API client.
     * @param {Object} io socket.io.
     * @param {string} channel Channel name.
     * @param {string} user Sender username.
     * @param {string} message Message received text.
     * @param {Object} store Bot state.
     * @param {Object} msg Twurple's full message object containing all message and user information.
     */
    constructor(client, apiClient, io, channel, user, message, store, msg) {
        this.client = client;
        this.apiClient = apiClient;
        this.io = io;
        this.channel = channel;
        this.user = user;
        this.message = message;
        this.store = store;
        this.msg = msg;

        // Remove extra whitespace and get words in the message as an array
        this.words = message.replace(/\s+/g, " ").trim().split(" ");
    }

    hasBotPrefix() {
        this.words[0] === this.store.botPrefix;
    }
};
