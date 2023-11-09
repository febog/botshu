const HandlerParameter = require("./handler-parameter.js");

/**
 * Class that all chat message handlers inherit from.
 * Provides an array of functions that will each be executed when a new chat
 * message arrives. All these functions recieve a single `HandlerParameter`
 * object.
 */
module.exports = class ChatMessageHandler {
    constructor(handlers) {
        /**
         * Array of functions that receive the chat parameter object to handle
         * a message.
         */
        this.handlers = handlers;
    }

    /**
     * Runs all the ChatMessageHandler handlers on the given message.
     * @param {HandlerParameter} chatParameter The chat parameter object.
     */
    handleMessage(chatParameter) {
        this.handlers.forEach(handler => handler(chatParameter));
    }
}
