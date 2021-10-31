// Handle messages via the message handlers defined in the lib/handlers folder
// This module provides the logic for giving diferent access levels to the
// message handlers.
// All message handlers receive a MessageHandlerParameter object defined in
// handler-parameter.js

const enableDisable = require("./enable-disable.js");
const management = require("./management.js");
const public = require("./public.js");
const nonSub = require("./nonsub.js");

module.exports = {
    /**
     * Run all the message handlers
     * @param {Object} p Message handler parameter object.
     */
    handleMessage(p) {
        const canManageBot = userCanManageBot(p.user);

        if (canManageBot) {
            enableDisable.handleEnableDisableMessage(p);
        }

        if (!p.store.isBotEnabled()) return;

        if (canManageBot) {
            management.handleManagementMessage(p);
        }

        if (p.store.isStreamLive()) {
            public.handlePublicMessage(p);

            if (!p.user.subscriber) {
                nonSub.handleNonSubMessage(p);
            }
        }
    },
};

/**
 * Returns true if the user can manage the bot.
 * Only moderators and the broadcaster can manage the bot.
 * @param {Object} user The user object given by tmi.js.
 * @returns True if the user can manage the bot.
 */
function userCanManageBot(user) {
    return (
        user.mod ||
        user.badges?.broadcaster === "1" ||
        user.username === "febog"
    );
}
