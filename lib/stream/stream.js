const userId = process.env.TWITCH_USER_ID_MUSHU;

const subscriptions = [];

async function setupStreamState(apiClient, chatClient, listener, io, store) {
    // Add listeners to stream changes
    const onlineSubscription = listener.onStreamOnline(userId, (e) => {
        store.setStreamLive();
        chatClient.say(
            `#${e.broadcasterName}`,
            `${e.broadcasterDisplayName} just went live!`
        );
    });
    subscriptions.push(onlineSubscription);

    const offlineSubscription = listener.onStreamOffline(userId, (e) => {
        store.setStreamOffline();
        chatClient.say(
            `#${e.broadcasterName}`,
            `${e.broadcasterDisplayName} just went offline`
        );
    });
    subscriptions.push(offlineSubscription);

    const channelsubSubscription = listener.onChannelSubscription(userId, (e) => {
        let tier = parseTier(e.tier);
        store.state.plusPoints.registerSubscriptionEvent(tier);
        store.state.plusPoints.updateWidget(io);
        chatClient.say(
            `#${e.broadcasterName}`,
            `${e.userName} subscribed at Tier ${tier}!`
        );
    });
    subscriptions.push(channelsubSubscription);

    const channelsubMsgSubscription = listener.onChannelSubscriptionMessage(userId, (e) => {
        let tier = parseTier(e.tier);
        store.state.plusPoints.registerSubscriptionEvent(tier);
        store.state.plusPoints.updateWidget(io);
        chatClient.say(
            `#${e.broadcasterName}`,
            `${e.userName} resubscribed at Tier ${tier}!`
        );
    });
    subscriptions.push(channelsubMsgSubscription);

    // Get initial stream state
    let streams = await apiClient.streams.getStreamsByUserIds([
        process.env.TWITCH_USER_ID_MUSHU,
    ]);
    if (streams.length > 0) {
        store.setStreamLive();
    } else {
        store.setStreamOffline();
    }
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
    setupStreamState,
};
