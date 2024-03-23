const userId = process.env.TWITCH_USER_ID_MUSHU;

/**
 * Logic for keeping track of the stream online/offline state.
 */
module.exports = class Stream {
    constructor(botshu) {
        this.botshu = botshu;
        this.isStreamLive = false;
        this.onlineOfflinesubscriptions = [];

        // Add listeners to stream changes
        const onlineSubscription = this.botshu.listener.onStreamOnline(userId, (e) => {
            this.isStreamLive = true;
            if (this.botshu.store.isProduction()) {
                this.botshu.chatClient.say(
                    `#${e.broadcasterName}`,
                    `${e.broadcasterDisplayName} just went live! peepoHappy`
                );
            }
        });
        this.onlineOfflinesubscriptions.push(onlineSubscription);

        const offlineSubscription = this.botshu.listener.onStreamOffline(userId, (e) => {
            this.isStreamLive = false;
            if (this.botshu.store.isProduction()) {
                this.botshu.chatClient.say(
                    `#${e.broadcasterName}`,
                    `${e.broadcasterDisplayName} just went offline. Offline`
                );
            }
        });
        this.onlineOfflinesubscriptions.push(offlineSubscription);
    }

    async initialize() {
        this.isStreamLive = await this.getStreamStatus();
    }

    /**
     * Hits the API to get the current stream status.
     * @returns `true` if live.
     */
    async getStreamStatus() {
        const streams = await this.botshu.apiClient.streams.getStreamsByUserIds([userId]);
        return streams.length > 0;
    }
}
