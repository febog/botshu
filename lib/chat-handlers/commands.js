/**
 * BotShu chat commands
 */

// Global bot prefix
const BOT_PREFIX = "!botshu";

// Main chat bot enable/disable
const BOTSHU_ENABLE_COMMAND = BOT_PREFIX + "enable";
const BOTSHU_DISABLE_COMMAND = BOT_PREFIX + "disable";
const BOTSHU_STATUS_COMMAND = BOT_PREFIX + "status";

// Vanish command
const VANISH_COMMAND = "!vanish";

// Version command
const BOTSHU_VERSION_COMMAND = BOT_PREFIX + "version";

// Partner Plus widget management
const PARTNER_PLUS_WIDGET_RESET = BOT_PREFIX + "wreset";
const PARTNER_PLUS_WIDGET_SET = BOT_PREFIX + "wset";
const PARTNER_PLUS_TIER3_COUNT_SET = BOT_PREFIX + "wt3";
const PARTNER_PLUS_TIER3_GOAL_SET = BOT_PREFIX + "wgoal";
const PARTNER_PLUS_WIDGET_REFRESH = BOT_PREFIX + "wrefresh";

// Offline message management
const SET_OFFLINE_MESSAGE_COMMAND = BOT_PREFIX + "setmessage";

// Language detection management
const USER_STRIKES_RESET_COMMAND = BOT_PREFIX + "reset";
const GET_USER_COUNT_COMMAND = BOT_PREFIX + "count";

// Custom commands management
const CUSTOM_COMMAND_SET_COMMAND = BOT_PREFIX + "setcommand";
const CUSTOM_COMMAND_DELETE_COMMAND = BOT_PREFIX + "deletecommand";

module.exports = {
    BOT_PREFIX,
    BOTSHU_ENABLE_COMMAND,
    BOTSHU_DISABLE_COMMAND,
    BOTSHU_STATUS_COMMAND,
    VANISH_COMMAND,
    BOTSHU_VERSION_COMMAND,
    PARTNER_PLUS_WIDGET_RESET,
    PARTNER_PLUS_WIDGET_SET,
    PARTNER_PLUS_TIER3_COUNT_SET,
    PARTNER_PLUS_TIER3_GOAL_SET,
    PARTNER_PLUS_WIDGET_REFRESH,
    SET_OFFLINE_MESSAGE_COMMAND,
    USER_STRIKES_RESET_COMMAND,
    GET_USER_COUNT_COMMAND,
    CUSTOM_COMMAND_SET_COMMAND,
    CUSTOM_COMMAND_DELETE_COMMAND,
};
