var express = require("express");
var router = express.Router();
const axios = require("axios");

function getRank(res) {
    axios
        .get("https://api.henrikdev.xyz/valorant/v1/mmr/eu/NotRealMushu/EUW")
        .then(function (response) {
            // handle success
            res.send(response.data?.data?.currenttierpatched);
        });
}

module.exports = {
    getRouter() {
        let rankInformation = "foo3";

        /* GET queue page. */
        router.get("/", function (req, res, next) {
            getRank(res);
        });

        return router;
    },
};
