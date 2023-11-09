const ChatMessageHandler = require("../chat-message-handler.js");

const {
    PARTNER_PLUS_WIDGET_RESET,
    PARTNER_PLUS_WIDGET_SET,
    PARTNER_PLUS_TIER3_COUNT_SET,
    PARTNER_PLUS_TIER3_GOAL_SET,
    PARTNER_PLUS_WIDGET_REFRESH,
} = require("../commands.js");

const partnerPlusHandlers = [
    function plusPointsReset(p) {
        if (p.message.startsWith(PARTNER_PLUS_WIDGET_RESET)) {
            p.store.state.plusPoints.resetSessionState();
            p.store.state.plusPoints.updateWidget(p.io);
            p.client.say(p.channel, "Widget has been reset");
        }
    },
    function plusPointsSet(p) {
        if (p.message.startsWith(PARTNER_PLUS_WIDGET_SET)) {
            p.store.state.plusPoints.setCurrentPoints(Number(p.words[2]));
            p.store.state.plusPoints.updateWidget(p.io);
            p.client.say(p.channel, "Partner Plus Points set");
        }
    },
    function plusPointsTier3(p) {
        if (p.message.startsWith(PARTNER_PLUS_TIER3_COUNT_SET)) {
            p.store.state.plusPoints.setCurrentTier3Count(Number(p.words[2]));
            p.store.state.plusPoints.updateWidget(p.io);
            p.client.say(p.channel, "Current Tier 3 count set");
        }
    },
    function plusPointsGoal(p) {
        if (p.message.startsWith(PARTNER_PLUS_TIER3_GOAL_SET)) {
            p.store.state.plusPoints.setTodaysTier3Goal(Number(p.words[2]));
            p.store.state.plusPoints.updateWidget(p.io);
            p.client.say(p.channel, "Tier 3 goal set");
        }
    },
    function plusPointsRefresh(p) {
        if (p.message.startsWith(PARTNER_PLUS_WIDGET_REFRESH)) {
            p.store.state.plusPoints.updateWidget(p.io);
            p.client.say(p.channel, "Widget refreshed");
        }
    },
];

/**
 * Partner Plus widget management commands.
 */
module.exports = class PartnerPlusHandler extends ChatMessageHandler {
    constructor() {
        super(partnerPlusHandlers);
    }
};
