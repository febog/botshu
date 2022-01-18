var express = require("express");
var router = express.Router();

module.exports = {
    getRouter(store) {
        // Setup Router

        /* GET home page. */
        router.get("/", function (req, res, next) {
            res.render("index", { title: `BotShu V${store.getBotVersion()}` });
        });

        return router;
    },
};
