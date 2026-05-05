/**
 * Logic for keeping track of the stream online/offline state.
 */
class StreamService {
  #twitchApiClient;
  #chatClient;
  #listenerService;
  #userId;
  #subscriptions = [];
  #isStreamLive = false;

  constructor({ twitchApiClient, chatClient, listenerService, userId }) {
    this.#twitchApiClient = twitchApiClient;
    this.#chatClient = chatClient;
    this.#listenerService = listenerService;
    this.#userId = userId;
    this.#subscribeToStreamChanges();
  }

  isLive() {
    return this.#isStreamLive;
  }

  async initialize() {
    this.#isStreamLive = await this.#getStreamStatus();
  }

  /**
   * Hits the API to get the current stream status.
   * @returns `true` if live.
   */
  async #getStreamStatus() {
    const streams = await this.#twitchApiClient.streams.getStreamsByUserIds([this.#userId]);
    return streams.length > 0;
  }

  #subscribeToStreamChanges() {
    // Add listeners to stream changes
    const onlineSubscription = this.#listenerService.onStreamOnline(this.#userId, (e) => {
      this.#isStreamLive = true;
      this.#chatClient.say(
        `#${e.broadcasterName}`,
        `${e.broadcasterDisplayName} just went live! peepoHappy`
      );
    });
    this.#subscriptions.push(onlineSubscription);

    const offlineSubscription = this.#listenerService.onStreamOffline(this.#userId, (e) => {
      this.#isStreamLive = false;
      this.#chatClient.say(
        `#${e.broadcasterName}`,
        `${e.broadcasterDisplayName} just went offline. mushuOffline`
      );
    });
    this.#subscriptions.push(offlineSubscription);
  }
}

export const createStreamService = async ({ twitchApiClient, chatClient, listenerService, userId }) => {
  const streamService = new StreamService({ twitchApiClient, chatClient, listenerService, userId });
  await streamService.initialize();
  return streamService;
};
