/**
 * Main application.
 */

const HandlerParameter = require("./chat-handlers/handler-parameter.js");
const MessageHandlers = require("./chat-handlers/message-handlers.js")
const languageDetection = require("./language/language.js")

module.exports = class BotShu {
    constructor(chatClient, apiClient, socketio, storage, store) {
        this.chatClient = chatClient
        this.apiClient = apiClient
        this.io = socketio;
        this.storage = storage;
        this.store = store;

        this.messageHandlers = new MessageHandlers();
        this.languageDetection = languageDetection;
    }

    start() {
        this.#handleChatMessages();
    }

    #handleChatMessages() {
        this.chatClient.onMessage(async (channel, user, text, msg) => {
            // If the message comes from the bot itself, ignore.
            if (user === "modshu") return;

            const p = new HandlerParameter(
                this.chatClient,
                this.apiClient,
                this.io,
                channel,
                user,
                text,
                msg,
                this.store
            );

            this.messageHandlers.handleChatMessage(p);

            await this.languageDetection.handleMessageLanguage(p);
        });
    }
};
