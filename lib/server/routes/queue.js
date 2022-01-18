var express = require("express");
var router = express.Router();

module.exports = {
    getRouter(store) {
        const locals = {
            title: `BotShu V${store.getBotVersion()} - Song queue`,
        };
        // Setup Router

        /* GET queue page. */
        router.get("/", function (req, res, next) {
            res.render("queue", locals);
        });

        return router;
    },
};
