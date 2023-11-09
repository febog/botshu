const axios = require("axios");

module.exports = {
    /**
     * Call third party emote APIs to get the channel emotes.
     * @returns Array with the emote names.
     */
    async loadThirdPartyEmotes() {
        const emotes = [];
        // Get FFZ channel emotes
        const ffzResponse = await axios.get(process.env.FFZ_CHANNEL_EMOTES_URL);
        ffzResponse.data.sets[process.env.FFZ_SET_ID].emoticons.map((e) =>
            emotes.push(e.name)
        );

        // Get BTTV Global emotes, undocumented API.
        const bttvGlobalResponse = await axios.get(
            process.env.BTTV_GLOBAL_EMOTES_URL
        );
        bttvGlobalResponse.data.map((e) => emotes.push(e.code));

        // Get BTTV channel and shared emotes, undocumented API.
        const bttvChannelResponse = await axios.get(
            process.env.BTTV_CHANNEL_EMOTES_URL
        );
        bttvChannelResponse.data.channelEmotes.map((e) =>
            emotes.push(e.code)
        );
        bttvChannelResponse.data.sharedEmotes.map((e) =>
            emotes.push(e.code)
        );

        // Get 7TV channel emotes
        const seventvResponse = await axios.get(
            process.env.SEVENTV_CHANNEL_EMOTES_URL
        );
        seventvResponse.data.emote_set.emotes.map((e) => emotes.push(e.name));
        console.log("Number of emotes loaded: ", emotes.length);
        return emotes;
    }
};
