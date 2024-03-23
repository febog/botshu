/**
 * Main application.
 */

const HandlerParameter = require("./chat-handlers/handler-parameter.js");
const MessageHandlers = require("./chat-handlers/message-handlers.js");
const languageDetection = require("./language/language.js");

const PartnerPlus = require("./modules/partner-plus.js");
const Stream = require("./modules/stream.js");

const extensionEmotes = require("./extension-emotes.js");

module.exports = class BotShu {
    constructor(chatClient, apiClient, socketio, listener, storage, store) {
        this.chatClient = chatClient
        this.apiClient = apiClient
        this.io = socketio;
        this.listener = listener;
        this.storage = storage;
        this.store = store;

        this.modules = {};

        this.messageHandlers = new MessageHandlers();
        this.languageDetection = languageDetection;
    }

    async start() {
        await this.#loadModules();
        await this.#loadThirdPartyEmotes();
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
                this.store,
                this
            );

            this.messageHandlers.handleChatMessage(p);

            await this.languageDetection.handleMessageLanguage(p);
        });
    }

    async #loadModules() {
        const partnerPlus = new PartnerPlus(this);
        await partnerPlus.initialize();
        this.store.setPlusPoints(partnerPlus);
        this.modules.stream = new Stream(this);
        await this.modules.stream.initialize();
    }

    async #loadThirdPartyEmotes() {
        const emotes = await extensionEmotes.loadThirdPartyEmotes();
        this.store.state.emoteList = emotes;
    }
};
