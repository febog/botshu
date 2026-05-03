var express = require("express");
var router = express.Router();

module.exports = {
    getRouter(store) {
        const locals = {
            title: `BotShu V${process.env.npm_package_version} - Song queue`,
            queue: store.getSongQueue(),
        };
        // Setup Router

        /* GET queue page. */
        router.get("/", function (req, res, next) {
            res.render("queue", locals);
        });

        return router;
    },
};
