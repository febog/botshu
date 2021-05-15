// Store pattern for global bot state

const IS_PRODUCTION = process.env.PRODUCTION_MONKAW === "production";
const LOG_STORE = process.env.LOG_STORE === "enable";
const VERSION_NUMBER = "5.0alpha3";

module.exports = {
    debug: !IS_PRODUCTION,
    logStore: LOG_STORE,
    state: {
        botEnabled: false,
        streamLive: false,
        userStrikes: {},
        languageProcessingState: { sleeping: false },
    },
    /**
     * Get the environment.
     * @returns True if production.
     */
    isProduction() {
        if (this.logStore) console.log("isProduction triggered");
        return IS_PRODUCTION;
    },
    /**
     * Get the global bot enabled state.
     * @returns True if enabled.
     */
    isBotEnabled() {
        if (this.logStore) console.log("isBotEnabled triggered");
        return this.state.botEnabled;
    },
    /**
     * Turns the bot on with a fresh state.
     */
    enableBot() {
        if (this.logStore) console.log("enableBot triggered");
        this.state.botEnabled = true;
        this.state.userStrikes = new Map();
        this.state.streamLive = false;
        console.log(`BotShu is now enabled.`);
    },
    /**
     * Disables the bot and deletes users strikes.
     */
    disableBot() {
        if (this.logStore) console.log("disableBot triggered");
        this.state.botEnabled = false;
        this.state.userStrikes = {};
        console.log(`BotShu is now disabled.`);
    },
    /**
     * Returns true if the stream is live.
     * @returns True if live, false if offline.
     */
    isStreamLive() {
        if (this.logStore) console.log("isStreamLive triggered");
        return this.state.streamLive;
    },
    /**
     * Sets the stream to live status.
     */
    setStreamLive() {
        if (this.logStore) console.log("setStreamLive triggered");
        this.state.streamLive = true;
    },
    /**
     * Sets the stream to offline status.
     */
    setStreamOffline() {
        if (this.logStore) console.log("setStreamOffline triggered");
        this.state.streamLive = false;
    },
    /**
     * Get bot version number.
     * @returns Version number.
     */
    getVersion() {
        if (this.logStore) console.log("getVersion triggered");
        return VERSION_NUMBER;
    },
    /**
     * Get langugage processing sleep state.
     * @returns Language processing state object.
     */
    getLanguageSleepState() {
        if (this.logStore) console.log("getLanguageSleepState triggered");
        return this.state.languageProcessingState;
    },
    /**
     * Reset all users strikes
     */
    resetAllStrikes() {
        if (this.logStore) console.log("resetAllStrikes triggered");
        this.state.userStrikes = new Map();
    },
    /**
     * Get the number of times the user has been detected to violate the rules.
     * @param {string} username User to check.
     * @returns Number of strikes.
     */
    getUserStrikes(username) {
        if (this.logStore) console.log("getUserStrikes triggered");
        return this.state.userStrikes.get(username);
    },
    /**
     * Check if a user has strikes.
     * @param {string} username User to check.
     * @returns True if the user has at least one strike.
     */
    userHasStrikes(username) {
        if (this.logStore) console.log("userHasStrikes triggered");
        return this.state.userStrikes.has(username);
    },
    /**
     * Remove all strikes from a user.
     * @param {string} username User to check.
     * @returns True if the user had strikes and has been cleared.
     */
    removeUserStrikes(username) {
        if (this.logStore) console.log("removeUserStrikes triggered");
        return this.state.userStrikes.delete(username);
    },
    /**
     * Increase the strike count of the given user by one.
     * @param {string} username User to give strike to.
     */
    addUserStrike(username) {
        if (this.logStore) console.log("addUserStrike triggered");
        if (this.userHasStrikes(username)) {
            // Get the current of strikes and increase it by one.
            let strikes = this.getUserStrikes(username);
            this.state.userStrikes.set(username, ++strikes);
        } else {
            // First strike
            this.state.userStrikes.set(username, 1);
        }
    },
};
