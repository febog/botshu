/**
 * Class that all chat message handlers inherit from.
 * Provides an array of functions that will each be executed when a new chat
 * message arrives. All these functions recieve a single parameter: the
 * "chat parameter object".
 */
module.exports = class ChatMessageHandler {
    constructor(handlers) {
        // Array of functions
        this.handlers = handlers;
    }

    handleMessage(chatParameter) {
        this.handlers.forEach(handler => handler(chatParameter));
    }
}