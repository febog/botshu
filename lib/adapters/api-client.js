
module.exports = class ApiClient {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }

    async isMushuStreamOnline() {
        const streams = await this.apiClient.streams.getStreamsByUserIds([
            process.env.TWITCH_USER_ID_MUSHU,
        ]);
        if (streams.length > 0) {
            return true;
        } else {
            return false;
        }
    }
};
