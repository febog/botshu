// Feature flags

module.exports = {
    OFFLINE_MESSAGE_ENABLED: process.env.OFFLINE_MESSAGE_ENABLED ?? false,
    CANDY_COMMAND_ENABLED: process.env.CANDY_COMMAND_ENABLED ?? false,
};
