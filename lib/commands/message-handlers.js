// Handle messages via the message handlers defined in the lib/handlers folder
// This module provides the logic for giving diferent access levels to the
// message handlers.
// All message handlers receive a MessageHandlerParameter object defined in
// handler-parameter.js

const features = require("./common/features.js");
const enableDisable = require("./handlers/enable-disable.js");
const management = require("./handlers/management.js");
const nonSub = require("./handlers/nonsub.js");
const offline = require("./handlers/offline.js");
const public = require("./handlers/public.js");
const songQueue = require("./handlers/song-queue.js");

module.exports = {
    /**
     * Run all the message handlers
     * @param {Object} p Message handler parameter object.
     */
    handleMessage(p) {
        const canManageBot = userCanManageBot(p.msg.userInfo);

        if (canManageBot) {
            enableDisable.handleEnableDisableMessage(p);
        }

        if (!p.store.isBotEnabled()) return;

        if (canManageBot) {
            management.handleManagementMessage(p);
            songQueue.handleSongQueueMessage(p);
        }

        if (p.store.isStreamLive()) {
            public.handlePublicMessage(p);

            if (!p.msg.userInfo.isSubscriber) {
                nonSub.handleNonSubMessage(p);
            }
        } else if (!canManageBot && features.OFFLINE_MESSAGE_ENABLED) {
            offline.handleOfflineMessage(p);
        }
    },
};

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
