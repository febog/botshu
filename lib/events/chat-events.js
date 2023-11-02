// Update the Partner Plus Points widget based on sub and resub chat events.

async function handleChatEvents(chatClient, io, store) {
    chatClient.onSub((channel, subscriber, subInfo) => {
        const tier = parseTier(subInfo.plan);
        if (!subInfo.isPrime && tier != 0) {
            // Non-gifted, non-prime and valid Tier (1, 2 or 3)
            // This event only fires on non-gifted subs
            store.state.plusPoints.registerSubscriptionEvent(tier);
            store.state.plusPoints.updateWidget(io);
            chatClient.say(channel, `${subscriber} subbed as Tier ${tier}!`);
        }
    });

    chatClient.onResub((channel, subscriber, subInfo) => {
        const tier = parseTier(subInfo.plan);
        if (!subInfo.isPrime && tier != 0) {
            // Non-gifted, non-prime and valid Tier (1, 2 or 3)
            // This event only fires on non-gifted subs
            store.state.plusPoints.registerSubscriptionEvent(tier);
            store.state.plusPoints.updateWidget(io);
            chatClient.say(channel, `${subscriber} resubbed as Tier ${tier}!`);
        }
    });
}

function parseTier(tierString) {
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

module.exports = {
    handleChatEvents,
};
