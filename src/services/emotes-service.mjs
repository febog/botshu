
// The code loads emotes from 3 different extension emote providers.

// FFZ (https://www.frankerfacez.com/)
// API Documentation: https://api.frankerfacez.com/docs/#/Rooms/get_v1_room_id__twitchID_
const FFZ_CHANNEL_EMOTES_URL_BASE = "https://api.frankerfacez.com/v1/room/id/";
// BTTV (https://betterttv.com/)
// API Documentation: https://betterttv.com/developers/api#user
const BTTV_CHANNEL_EMOTES_URL_BASE = "https://api.betterttv.net/3/cached/users/twitch/";
const BTTV_GLOBAL_EMOTES_URL = "https://api.betterttv.net/3/cached/emotes/global";
// 7TV (https://7tv.app/)
// API Documentation: https://7tv.io/docs ("Get User Connection")
const SEVENTV_CHANNEL_EMOTES_URL_BASE = "https://7tv.io/v3/users/twitch/";

class EmotesService {
  #channelId;
  #emoteList = [];

  constructor({ channelId }) {
    this.#channelId = channelId;
  }

  getEmotes() {
    return this.#emoteList;
  }

  async loadEmoteList() {
    const emotes = [];

    // Get FFZ channel emotes
    const ffzResponse = await fetch(`${FFZ_CHANNEL_EMOTES_URL_BASE}${this.#channelId}`);
    const ffzData = await ffzResponse.json();
    const FFZ_SET_ID = ffzData.room.set;
    ffzData.sets[FFZ_SET_ID].emoticons.map((e) => emotes.push(e.name));

    // Get BTTV channel and shared emotes, undocumented API.
    const bttvChannelResponse = await fetch(`${BTTV_CHANNEL_EMOTES_URL_BASE}${this.#channelId}`);
    const bttvChannelData = await bttvChannelResponse.json();
    bttvChannelData.channelEmotes.map((e) => emotes.push(e.code));
    bttvChannelData.sharedEmotes.map((e) => emotes.push(e.code));

    // Get BTTV Global emotes, undocumented API.
    const bttvGlobalResponse = await fetch(BTTV_GLOBAL_EMOTES_URL);
    const bttvGlobalData = await bttvGlobalResponse.json();
    bttvGlobalData.map((e) => emotes.push(e.code));

    // Get 7TV channel emotes
    const seventvResponse = await fetch(`${SEVENTV_CHANNEL_EMOTES_URL_BASE}${this.#channelId}`);
    const seventvData = await seventvResponse.json();
    seventvData.emote_set.emotes.map((e) => emotes.push(e.name));

    console.log("Number of emotes loaded: ", emotes.length);
    this.#emoteList = emotes;
  }
}

export const createEmotesService = async ({ channelId }) => {
  const emoteService = new EmotesService({ channelId });
  await emoteService.loadEmoteList();
  return emoteService;
};
