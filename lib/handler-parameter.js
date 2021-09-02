// Parameter object used by all the bot's message handlers
// It contains all the parameters needed to handle a message received by the
// bot.

module.exports = {
    parameters: {
        client: null,
        channel: "",
        user: null,
        message: "",
        store: null,
        words: [],
        hasBotPrefix: () => false,
    },
    /**
     * Set all the parameters needed to handle a message received by the bot.
     * @param {Object} client Tmi.js client.
     * @param {string} channel Channel name.
     * @param {Object} user Userstate object.
     * @param {string} message Message received.
     * @param {Object} store Bot state.
     */
    setParameters(client, channel, user, message, store) {
        this.parameters.client = client;
        this.parameters.channel = channel;
        this.parameters.user = user;
        this.parameters.message = message;
        this.parameters.store = store;
        // Remove extra whitespace and get words in the message as an array
        this.parameters.words = message.replace(/\s+/g, " ").trim().split(" ");
        this.hasBotPrefix = () =>
            this.parameters.words[0] === this.parameters.store.botPrefix;
    },
    getParameters() {
        return this.parameters;
    },
};
