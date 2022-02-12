var express = require("express");
var router = express.Router();

module.exports = {
    getRouter(store) {
        // Setup Router
        const locals = {
            title: `BotShu V${store.getBotVersion()}`,
            streamStatus: p.store.isStreamLive() ? "Live" : "Offline",
        };

        /* GET home page. */
        router.get("/", function (req, res, next) {
            res.render("index", locals);
        });

        return router;
    },
};
