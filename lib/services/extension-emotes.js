// Helper methods for loading the channel emotes provided by third party
// extensions.

const axios = require("axios");

module.exports = {
    /**
     * Call third party emote services and load the channel emotes into the bot
     * global state.
     * @param {Object} store Bot state.
     */
    async loadThirdPartyEmotes(store) {
        // Get FFZ channel emotes
        const ffzResponse = await axios.get(process.env.FFZ_CHANNEL_EMOTES_URL);
        ffzResponse.data.sets[process.env.FFZ_SET_ID].emoticons.map((e) =>
            store.state.emoteList.push(e.name)
        );

        // Get BTTV Global emotes, undocumented API.
        const bttvGlobalResponse = await axios.get(
            process.env.BTTV_GLOBAL_EMOTES_URL
        );
        bttvGlobalResponse.data.map((e) => store.state.emoteList.push(e.code));

        // Get BTTV channel and shared emotes, undocumented API.
        const bttvChannelResponse = await axios.get(
            process.env.BTTV_CHANNEL_EMOTES_URL
        );
        bttvChannelResponse.data.channelEmotes.map((e) =>
            store.state.emoteList.push(e.code)
        );
        bttvChannelResponse.data.sharedEmotes.map((e) =>
            store.state.emoteList.push(e.code)
        );
        console.log("Number of emotes loaded: ", store.state.emoteList.length);
    },
};
