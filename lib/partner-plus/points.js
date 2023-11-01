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

var CURRENT_PLUS_POINTS = 0;
var CURRENT_SESSION_TIER_1 = 0;
var CURRENT_SESSION_TIER_2 = 0;
var CURRENT_SESSION_TIER_3 = 0;
var TIER_3_GOAL = 0;

const WIDGET_STATE = {
    pointsCounter: `${CURRENT_PLUS_POINTS}/${PARTNER_PLUS_THRESHOLD}`,
    tier3Counter: `${CURRENT_SESSION_TIER_3}/${TIER_3_GOAL}`,
}

/**
 * Increases the `CURRENT_POINTS` according to the given sub tier and the
 * respective sub counters.
 * @param {*} tier Tier of the sub received {1,2,3}
 * @returns An object that contains the updated data required for the widget
 */
function registerSubscriptionEvent(tier) {
    switch (tier) {
        case 1:
            CURRENT_PLUS_POINTS += TIER_1_VALUE;
            CURRENT_SESSION_TIER_1++;
            break;

        case 2:
            CURRENT_PLUS_POINTS += TIER_2_VALUE;
            CURRENT_SESSION_TIER_2++;
            break;

        case 3:
            CURRENT_PLUS_POINTS += TIER_3_VALUE;
            CURRENT_SESSION_TIER_3++;
            break;

        default:
            break;
    }
    return WIDGET_STATE;
}

// Only exposing the values I need to change via functions.

function resetSessionState() {
    CURRENT_PLUS_POINTS = 0;
    CURRENT_SESSION_TIER_1 = 0;
    CURRENT_SESSION_TIER_2 = 0;
    CURRENT_SESSION_TIER_3 = 0;
    TIER_3_GOAL = 0;
}

function setCurrentPoints(points) {
    CURRENT_PLUS_POINTS = points;
}

// Creating this just in case
function setCurrentTier3Count(count) {
    CURRENT_SESSION_TIER_3 = count;
}

function setTodaysTier3Goal(goal) {
    TIER_3_GOAL = goal;
}

function getState() {
    return WIDGET_STATE;
}

function updateWidget(io) {
    // Broadcast the message to all connected clients
    io.emit('points-update', WIDGET_STATE.pointsCounter);
    io.emit('tier3-update', WIDGET_STATE.tier3Counter);
}

module.exports = {
    registerSubscriptionEvent,
    resetSessionState,
    setCurrentPoints,
    setCurrentTier3Count,
    setTodaysTier3Goal,
    getState,
    updateWidget,
};