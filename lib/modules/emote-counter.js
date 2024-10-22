const storage = require("../storage.js");

const userId = process.env.TWITCH_USER_ID_MUSHU;
const EMOTE_COUNT_BLOB = `emoteCount.${userId}.json`

/**
 * Implements the logic for third party emote usage
 */
module.exports = class EmoteCounter {
    constructor(botshu) {
        this.botshu = botshu;
    }

    #emoteCountMap = null;
    #emoteList = null; // TODO: use global state, need to init also

    // TODO: persist emote count at the right
    // set currentPlusPoints(points) {
    //     this.#points = points;
    //     this.updateWidget();
    //     this.#saveCount(this.currentPlusPoints);
    // }

    // get currentPlusPoints() {
    //     return this.#points;
    // }

    async initialize() {
        // TODO: Load state from storage

        // this.currentPlusPoints = await this.#loadCount();
        // const chatClient = this.botshu.chatClient;

    }

    /**
     * Persist to storage the emote count data from a map.
     * @param {*} emoteCountMap 
     */
    async #saveCount(emoteCountMap) {
        const countData = Array.from(emoteCountMap.entries());
        await storage.storeJsonToBlobStorage(countData, EMOTE_COUNT_BLOB);
    }

    /**
     * Read emote count data from storage
     * @returns Map with emote count data
     */
    async #loadCount() {
        const mapEntries = await storage.readJsonFromBlobStorage(EMOTE_COUNT_BLOB);
        const countMap = new Map(mapEntries);
        return countMap;
    }
}
