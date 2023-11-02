const userId = process.env.TWITCH_USER_ID_MUSHU;

const subscriptions = [];

async function setupStreamState(apiClient, chatClient, listener, store) {
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

module.exports = {
    setupStreamState,
};
