const HandlerParameter = require("./handler-parameter.js");

const EnableDisableHandler = require("./handlers/enable-disable.js");
const LanguageDetectionManagementHandler = require("./handlers/language-detection-management.js");
const OfflineMessageManagementHandler = require("./handlers/offline-message-management.js");
const VersionHandler = require("./handlers/version.js");
const CandyManagementHandler = require("./handlers/candy-management.js");
const CustomCommandsManagementHandler = require("./handlers/custom-commands-management.js");
const PartnerPlusHandler = require("./handlers/partner-plus.js");
const SongQueueHandler = require("./handlers/song-queue.js");
const PublicHandler = require("./handlers/public.js");
const CustomCommandsHandler = require("./handlers/custom-commands.js");
const VanishHandler = require("./handlers/vanish.js");
const DiscordTagHandler = require("./handlers/discord-tag.js");
const OfflineMessageHandler = require("./handlers/offline-message.js");

/**
 * Serves as the container of all the message handlers and
 * the logic to call them.
 * All message handlers inherit from `ChatMessageHandler`.
 */
module.exports = class MessageHandlers {
    constructor() {
        // Main chatbot enable/disable, staff only
        this.enableDisable = new EnableDisableHandler();
        // Staff only commands
        this.languageDetectionManagement = new LanguageDetectionManagementHandler();
        this.offlineMessageManagement = new OfflineMessageManagementHandler();
        this.version = new VersionHandler();
        this.candyManagement = new CandyManagementHandler();
        this.customCommandsManagement = new CustomCommandsManagementHandler();
        this.partnerPlus = new PartnerPlusHandler();
        this.songQueue = new SongQueueHandler();
        // Commands for everyone
        this.public = new PublicHandler();
        this.customCommands = new CustomCommandsHandler();
        // Commands for subscribers only
        this.vanish = new VanishHandler();
        // Commands for non subscribers only
        this.discordTag = new DiscordTagHandler();
        // Commands that only run when stream is offline
        this.offlineMessage = new OfflineMessageHandler();
    }

    /**
     * Main chatbot enable/disable, staff only
     * @param {HandlerParameter} p Chat message parameter object.
     */
    #enableDisableHandler(p) {
        this.enableDisable.handleMessage(p);
    }

    /**
     * Staff only commands
     * @param {HandlerParameter} p Chat message parameter object.
     */
    #staffOnlyHandlers(p) {
        this.languageDetectionManagement.handleMessage(p);
        this.offlineMessageManagement.handleMessage(p);
        this.version.handleMessage(p);
        this.candyManagement.handleMessage(p);
        this.customCommandsManagement.handleMessage(p);
        this.partnerPlus.handleMessage(p);
        this.songQueue.handleMessage(p);
    }

    /**
     * Commands for everyone
     * @param {HandlerParameter} p Chat message parameter object.
     */
    #publicHandlers(p) {
        this.public.handleMessage(p);
        this.customCommands.handleMessage(p);
    }

    /**
     * Commands for subscribers only
     * @param {HandlerParameter} p Chat message parameter object.
     */
    #subscriberHandlers(p) {
        this.vanish.handleMessage(p);
    }

    /**
     * Commands for non subscribers only
     * @param {HandlerParameter} p Chat message parameter object.
     */
    #nonsubHandlers(p) {
        this.discordTag.handleMessage(p);
    }

    /**
     * Commands that only run when stream is offline
     * @param {HandlerParameter} p Chat message parameter object.
     */
    #offlineHandlers(p) {
        this.offlineMessage.handleMessage(p);
    }

    /**
     * Calls all registered ChatMessageHandlers according to their permissions.
     * @param {HandlerParameter} p Chat message parameter object.
     */
    handleChatMessage(p) {
        const canManageBot = userCanManageBot(p.msg.userInfo);

        if (canManageBot) {
            this.#enableDisableHandler(p);
        }

        if (!p.store.isBotEnabled()) return;

        if (canManageBot) {
            this.#staffOnlyHandlers(p);
        }

        this.#publicHandlers(p);

        if (p.msg.userInfo.isSubscriber) {
            this.#subscriberHandlers(p);
        } else {
            this.#nonsubHandlers(p);
        }

        if (!canManageBot && features.OFFLINE_MESSAGE_ENABLED && !p.store.isStreamLive()) {
            this.#offlineHandlers(p);
        }
    }
}

/**
 * Returns true if the user can manage the bot.
 * Only moderators and the broadcaster can manage the bot.
 * @param {Object} userInfo The user object given by Twurple's msg object.
 * @returns True if the user can manage the bot.
 */
function userCanManageBot(userInfo) {
    return (
        userInfo.isMod ||
        userInfo.isBroadcaster ||
        userInfo.displayName === "febog"
    );
}
