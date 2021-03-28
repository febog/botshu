// Store pattern for global bot state

const IS_PRODUCTION = process.env.PRODUCTION_MONKAW === "production";
const VERSION_NUMBER = "4.1";

module.exports = {
    debug: !IS_PRODUCTION,
    state: {
        botEnabled: false,
        userStrikes: {},
        languageProcessingState: { sleeping: false },
    },
    /**
     * Get the global bot enabled state.
     * @returns True if enabled.
     */
    isBotEnabled() {
        if (this.debug) console.log("isBotEnabled triggered");
        return this.state.botEnabled;
    },
    /**
     * Get the environment.
     * @returns True if production.
     */
    isProduction() {
        if (this.debug) console.log("isProduction triggered");
        return IS_PRODUCTION;
    },
    /**
     * Turns the bot on with a fresh state.
     */
    turnBotOn() {
        if (this.debug) console.log("turnBotOn triggered");
        this.state.botEnabled = true;
        this.state.userStrikes = new Map();
        console.log(`BotShu is now enabled.`);
    },
    /**
     * Disables the bot and deletes users strikes.
     */
    turnBotOff() {
        if (this.debug) console.log("turnBotOff triggered");
        this.state.botEnabled = false;
        this.state.userStrikes = {};
        console.log(`BotShu is now disabled.`);
    },
    /**
     * Get bot version number.
     * @returns Version number.
     */
    getVersion() {
        if (this.debug) console.log("getVersion triggered");
        return VERSION_NUMBER;
    },
    /**
     * Get langugage processing sleep state.
     * @returns Language processing state object.
     */
    getLanguageSleepState() {
        if (this.debug) console.log("getLanguageSleepState triggered");
        return this.state.languageProcessingState;
    },
    /**
     * Reset all users strikes
     */
    resetAllStrikes() {
        if (this.debug) console.log("resetAllStrikes triggered");
        this.state.userStrikes = new Map();
    },
    /**
     * Get the number of times the user has been detected to violate the rules.
     * @param {string} username User to check.
     * @returns Number of strikes.
     */
    getUserStrikes(username) {
        if (this.debug) console.log("getUserStrikes triggered");
        return this.state.userStrikes.get(username);
    },
    /**
     * Check if a user has strikes.
     * @param {string} username User to check.
     * @returns True if the user has at least one strike.
     */
    userHasStrikes(username) {
        if (this.debug) console.log("userHasStrikes triggered");
        return this.state.userStrikes.has(username);
    },
    /**
     * Remove all strikes from a user.
     * @param {string} username User to check.
     * @returns True if the user had strikes and has been cleared.
     */
    removeUserStrikes(username) {
        if (this.debug) console.log("removeUserStrikes triggered");
        return this.state.userStrikes.delete(username);
    },
    /**
     * Increase the strike count of the given user by one.
     * @param {string} username User to give strike to.
     */
    addUserStrike(username) {
        if (this.debug) console.log("addUserStrike triggered");
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
