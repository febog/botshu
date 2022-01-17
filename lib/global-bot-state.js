// Store pattern for global bot state

const axios = require("axios");
const IS_PRODUCTION = process.env.PRODUCTION_MONKAW === "production";
const LOG_STORE = process.env.LOG_STORE === "enable";
const VERSION_NUMBER = "7.1.0";

module.exports = {
    logStore: LOG_STORE,
    // Command prefix used by all handlers
    botPrefix: "!botshu",
    state: {
        botEnabled: false,
        streamLive: false,
        givingCandy: false,
        languageProcessingState: { sleeping: false },
        offlineMessage: "",
        userStrikes: new Map(),
        customCommands: new Map(),
        emoteList: [], // Emotes enabled in the channel
    },
    async getEmotes() {
        // Get FFZ channel emotes
        const ffzResponse = await axios.get(process.env.FFZ_CHANNEL_EMOTES_URL);
        ffzResponse.data.sets[process.env.FFZ_SET_ID].emoticons.map((e) =>
            this.state.emoteList.push(e.name)
        );

        // Get BTTV Global emotes, undocumented API.
        const bttvGlobalResponse = await axios.get(
            process.env.BTTV_GLOBAL_EMOTES_URL
        );
        bttvGlobalResponse.data.map((e) => this.state.emoteList.push(e.code));

        // Get BTTV channel and shared emotes, undocumented API.
        const bttvChannelResponse = await axios.get(
            process.env.BTTV_CHANNEL_EMOTES_URL
        );
        bttvChannelResponse.data.channelEmotes.map((e) =>
            this.state.emoteList.push(e.code)
        );
        bttvChannelResponse.data.sharedEmotes.map((e) =>
            this.state.emoteList.push(e.code)
        );
        console.log("Number of emotes loaded: ", this.state.emoteList.length);
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
        await this.getEmotes();
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
    isStreamLive() {
        if (this.logStore) console.log("isStreamLive triggered");
        return this.state.streamLive;
    },
    setStreamLive() {
        if (this.logStore) console.log("setStreamLive triggered");
        this.state.streamLive = true;
    },
    setStreamOffline() {
        if (this.logStore) console.log("setStreamOffline triggered");
        this.state.streamLive = false;
    },
    getBotVersion() {
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
};
