
module.exports = {
    /**
     * Call third party emote APIs to get the channel emotes.
     * @returns Array with the emote names.
     */
    async loadThirdPartyEmotes() {
        const emotes = [];
        // Get FFZ channel emotes
        const ffzResponse = await fetch(process.env.FFZ_CHANNEL_EMOTES_URL);
        const ffzData = await ffzResponse.json();
        ffzData.sets[process.env.FFZ_SET_ID].emoticons.map((e) => emotes.push(e.name));

        // Get BTTV Global emotes, undocumented API.
        const bttvGlobalResponse = await fetch(process.env.BTTV_GLOBAL_EMOTES_URL);
        const bttvGlobalData = await bttvGlobalResponse.json();
        bttvGlobalData.map((e) => emotes.push(e.code));

        // Get BTTV channel and shared emotes, undocumented API.
        const bttvChannelResponse = await fetch(process.env.BTTV_CHANNEL_EMOTES_URL);
        const bttvChannelData = await bttvChannelResponse.json();
        bttvChannelData.channelEmotes.map((e) => emotes.push(e.code));
        bttvChannelData.sharedEmotes.map((e) => emotes.push(e.code));

        // Get 7TV channel emotes
        const seventvResponse = await fetch(process.env.SEVENTV_CHANNEL_EMOTES_URL);
        const seventvData = await seventvResponse.json();
        seventvData.emote_set.emotes.map((e) => emotes.push(e.name));

        console.log("Number of emotes loaded: ", emotes.length);
        return emotes;
    }
};
