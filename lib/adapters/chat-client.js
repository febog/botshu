
module.exports = class ChatClient {
    constructor(chatClient) {
        this.chatClient = chatClient;
    }

    say(channel, text) {
        this.chatClient.say(channel, text);
    }
};
