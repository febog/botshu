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


module.exports = {
    BOT_PREFIX,
    BOTSHU_ENABLE_COMMAND,
    BOTSHU_DISABLE_COMMAND,
    BOTSHU_STATUS_COMMAND,
    VANISH_COMMAND,
    BOTSHU_VERSION_COMMAND,
};
