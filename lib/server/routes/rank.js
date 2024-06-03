var express = require("express");
var router = express.Router();
const axios = require("axios");

const VALORANT_API_KEY = process.env.VALORANT_API_KEY;

function getRank(res) {
    axios
        .get("https://api.henrikdev.xyz/valorant/v1/mmr/eu/Mushu/2725?api_key=" + VALORANT_API_KEY)
        .then(function (response) {
            const rankTier = response.data?.data?.currenttierpatched;
            const rankRating = response.data?.data?.ranking_in_tier;
            // Form command response as "Diamond 3 - 71RR"
            const fullRank = `${rankTier} - ${rankRating}RR`;
            res.send(fullRank);
        });
}

module.exports = {
    getRouter() {
        /* GET queue page. */
        router.get("/", function (req, res, next) {
            getRank(res);
        });

        return router;
    },
};
