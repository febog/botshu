const ChatMessageHandler = require("../chat-message-handler.js");

const {
    PARTNER_PLUS_WIDGET_SET,
    PARTNER_PLUS_WIDGET_REFRESH,
} = require("../commands.js");

const partnerPlusHandlers = [
    function plusPointsSet(p) {
        if (p.message.startsWith(PARTNER_PLUS_WIDGET_SET)) {
            p.store.state.plusPoints.setCurrentPoints(Number(p.words[2]));
            p.store.state.plusPoints.updateWidget(p.io);
            p.client.say(p.channel, "Partner Plus Points set");
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
