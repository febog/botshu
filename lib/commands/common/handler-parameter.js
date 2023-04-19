// Parameter object used by all the bot's message handlers
// It contains all the parameters needed to handle a message received by the
// bot.

module.exports = {
    parameters: {
        client: null,
        apiClient: null,
        channel: "",
        user: null,
        message: "",
        store: null,
        msg: null,
        words: [],
        hasBotPrefix: () => false,
    },
    /**
     * Set all the parameters needed to handle a message received by the bot.
     * @param {Object} client Twurple chat client.
     * @param {Object} apiClient Twurple API client.
     * @param {string} channel Channel name.
     * @param {string} user Sender username.
     * @param {string} message Message received text.
     * @param {Object} store Bot state.
     * @param {Object} msg Twurple's full message object containing all message and user information.
     */
    setParameters(client, apiClient, channel, user, message, store, msg) {
        this.parameters.client = client;
        this.parameters.apiClient = apiClient;
        this.parameters.channel = channel;
        this.parameters.user = user;
        this.parameters.message = message;
        this.parameters.store = store;
        this.parameters.msg = msg;
        // Remove extra whitespace and get words in the message as an array
        this.parameters.words = message.replace(/\s+/g, " ").trim().split(" ");
        this.parameters.hasBotPrefix = () =>
            this.parameters.words[0] === this.parameters.store.botPrefix;
    },
    getParameters() {
        return this.parameters;
    },
};
