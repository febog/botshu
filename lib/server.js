// Creates a minimal Express.js server to respond to pings made to the App
// Service.
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

module.exports = {
    /**
     * Starts basic server using Express.js with the given version number as
     * part of the response.
     * @param {Object} store Bot state.
     */
    initializeBotServer(store) {
        app.get("/", (req, res) => {
            res.send(`BotShu V${store.getBotVersion()}`);
        });
        app.listen(port);
    },
};
