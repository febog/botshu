// Store pattern for global bot state

const IS_PRODUCTION = process.env.PRODUCTION_MONKAW === "production";
const LOG_STORE = process.env.LOG_STORE === "enable";

module.exports = {
    logStore: LOG_STORE,
    // Command prefix used by all handlers
    botPrefix: "!botshu",
    state: {
        botEnabled: true,
        givingCandy: false,
        languageProcessingState: { sleeping: false },
        offlineMessage: "",
        userStrikes: new Map(),
        customCommands: new Map(),
        emoteList: [], // Emotes enabled in the channel
        songQueue: [],
        plusPoints: null,
    },
    getEmoteList() {
        if (this.logStore) console.log("getEmoteList triggered");
        return this.state.emoteList;
    },
    isProduction() {
        if (this.logStore) console.log("isProduction triggered");
        return IS_PRODUCTION;
    },
    isBotEnabled() {
        if (this.logStore) console.log("isBotEnabled triggered");
        return this.state.botEnabled;
    },
    async enableBot() {
        if (this.logStore) console.log("enableBot triggered");
        this.state.botEnabled = true;
        console.log(`BotShu is now enabled.`);
    },
    disableBot() {
        if (this.logStore) console.log("disableBot triggered");
        this.state.botEnabled = false;
        this.state.userStrikes.clear();
        this.state.customCommands.clear();
        this.state.emoteList = [];
        console.log(`BotShu is now disabled.`);
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
    setOfflineMessage(message) {
        if (this.logStore) console.log("setOfflineMessage triggered");
        this.state.offlineMessage = message;
    },
    getOfflineMessage() {
        if (this.logStore) console.log("getOfflineMessage triggered");
        return this.state.offlineMessage;
    },
    setCustomCommand(command, response) {
        if (this.logStore) console.log("setCustomCommand triggered");
        this.state.customCommands.set(command, response);
    },
    deleteCustomCommand(command) {
        if (this.logStore) console.log("deleteCustomCommand triggered");
        this.state.customCommands.delete(command);
    },
    getCustomCommand(command) {
        if (this.logStore) console.log("getCustomCommand triggered");
        return this.state.customCommands.get(command);
    },
    isCustomCommand(command) {
        if (this.logStore) console.log("isCustomCommand triggered");
        return this.state.customCommands.has(command);
    },
    isGivingCandy() {
        if (this.logStore) console.log("isGivingCandy triggered");
        return this.state.givingCandy;
    },
    setGivingCandy(giveCandy) {
        if (this.logStore) console.log("setGivingCandy triggered");
        this.state.givingCandy = giveCandy;
    },
    getSongQueue() {
        if (this.logStore) console.log("getSongQueue triggered");
        return this.state.songQueue;
    },
    setPlusPoints(plusPoints) {
        if (this.logStore) console.log("setPlusPoints triggered");
        this.state.plusPoints = plusPoints;
    },
};
