// Implements the logic for keeping count of Partner Plus Program points
// and subscription events for a browser widget.
// Provides the data for a string that looks like:
//     Sub split: 270/350 points.

const storage = require("../storage.js");

// Partner plus points needed for eligibilty into the program
const PARTNER_PLUS_THRESHOLD = 350;
// Partner plus points value for each subscription tier
const TIER_1_VALUE = 1;
const TIER_2_VALUE = 2;
const TIER_3_VALUE = 6;

const userId = process.env.TWITCH_USER_ID_MUSHU;
const COUNT_DATA_BLOB = `points.${userId}.json`

/**
 * Manages the state of the Parter Plus Widget logic.
 */
module.exports = class PartnerPlus {
    constructor(botshu) {
        this.botshu = botshu;
    }

    #points = 0;

    set currentPlusPoints(points) {
        this.#points = points;
        this.updateWidget();
        this.#saveCount(this.currentPlusPoints);
    }

    get currentPlusPoints() {
        return this.#points;
    }

    async initialize() {
        // Load state from storage
        this.currentPlusPoints = await this.#loadCount();

        // Configure events that will update the points counter.
        // Update the Partner Plus Points widget based on sub and resub chat events.

        const chatClient = this.botshu.chatClient;

        chatClient.onSub((channel, subscriber, subInfo) => {
            const tier = this.#parseTier(subInfo.plan);
            if (!subInfo.isPrime && tier != 0) {
                // Non-gifted, non-prime and valid Tier (1, 2 or 3)
                // This event only fires on non-gifted subs
                this.#registerSubscriptionEvent(tier);
                chatClient.say(channel, `${subscriber} subbed as Tier ${tier}!`);
            }
        });

        chatClient.onResub((channel, subscriber, subInfo) => {
            const tier = this.#parseTier(subInfo.plan);
            if (!subInfo.isPrime && tier != 0) {
                // Non-gifted, non-prime and valid Tier (1, 2 or 3)
                // This event only fires on non-gifted subs
                this.#registerSubscriptionEvent(tier);
                chatClient.say(channel, `${subscriber} resubbed as Tier ${tier}!`);
            }
        });
    }

    /**
     * Increases the `currentPlusPoints` according to the given sub tier.
     * @param {Number} tier Tier of the sub received {1,2,3}
     */
    #registerSubscriptionEvent(tier) {
        switch (tier) {
            case 1:
                this.currentPlusPoints += TIER_1_VALUE;
                break;

            case 2:
                this.currentPlusPoints += TIER_2_VALUE;
                break;

            case 3:
                this.currentPlusPoints += TIER_3_VALUE;
                break;

            default:
                break;
        }
    }

    setCurrentPoints(points) {
        this.currentPlusPoints = points;
    }

    /**
     * Used by the endpoint for getting points on page load and for updating the
     * widget.
     * @returns String in the 0/350 format
     */
    getCounter() {
        return `${this.currentPlusPoints}/${PARTNER_PLUS_THRESHOLD}`;
    }

    updateWidget() {
        // Broadcast the message to all connected clients
        this.botshu.io.emit('points-update', `${this.getCounter()}`);
    }

    async #saveCount(count) {
        // Persist to storage
        const countData = {
            partnerPlusPoints: count,
        };
        await storage.storeJsonToBlobStorage(countData, COUNT_DATA_BLOB);
    }

    async #loadCount() {
        // Read from storage
        const countData = await storage.readJsonFromBlobStorage(COUNT_DATA_BLOB);
        return countData.partnerPlusPoints;
    }

    #parseTier(tierString) {
        let tier = 0;
        switch (tierString) {
            case "1000":
                tier = 1;
                break;

            case "2000":
                tier = 2;
                break;

            case "3000":
                tier = 3;
                break;

            default:
                break;
        }
        return tier;
    }
}
