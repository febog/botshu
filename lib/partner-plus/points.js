// Implements the logic for keeping count of Partner Plus Program points
// and subscription events for a browser widget.
// Provides the data for a string that looks like:
//     Sub split: 270/350 points. Today's Tier 3 goal: 3/8

// Partner plus points needed for eligibilty into the program
const PARTNER_PLUS_THRESHOLD = 350;
// Partner plus points value for each subscription tier
const TIER_1_VALUE = 1;
const TIER_2_VALUE = 2;
const TIER_3_VALUE = 6;

module.exports = {
    state: {
        currentPlusPoints: 0,
        currentTier1: 0,
        currentTier2: 0,
        currentTier3: 0,
        tier3Goal: 0,
    },
    /**
     * Increases the `CURRENT_POINTS` according to the given sub tier and the
     * respective sub counters.
     * @param {*} tier Tier of the sub received {1,2,3}
     * @returns An object that contains the updated data required for the widget
     */
    registerSubscriptionEvent(tier) {
        switch (tier) {
            case 1:
                this.state.currentPlusPoints += TIER_1_VALUE;
                this.state.currentTier1++;
                break;

            case 2:
                this.state.currentPlusPoints += TIER_2_VALUE;
                this.state.currentTier2++;
                break;

            case 3:
                this.state.currentPlusPoints += TIER_3_VALUE;
                this.state.currentTier3++;
                break;

            default:
                break;
        }
    },
    resetSessionState() {
        this.state.currentPlusPoints = 0;
        this.state.currentTier1 = 0;
        this.state.currentTier2 = 0;
        this.state.currentTier3 = 0;
        this.state.tier3Goal = 0;
    },
    setCurrentPoints(points) {
        this.state.currentPlusPoints = points;
    },
    // Creating this just in case
    setCurrentTier3Count(count) {
        this.state.currentTier3 = count;
    },
    setTodaysTier3Goal(goal) {
        this.state.tier3Goal = goal;
    },
    getState() {
        return `${this.state.currentPlusPoints}/${PARTNER_PLUS_THRESHOLD}`
            + `${this.state.currentTier3}/${this.state.tier3Goal}`;
    },
    updateWidget(io) {
        // Broadcast the message to all connected clients
        io.emit('points-update', `${this.state.currentPlusPoints}/${PARTNER_PLUS_THRESHOLD}`);
        io.emit('tier3-update', `${this.state.currentTier3}/${this.state.tier3Goal}`);
    }
};
