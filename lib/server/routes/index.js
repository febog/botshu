var express = require("express");
var router = express.Router();

module.exports = {
    getRouter(botshu) {
        // Setup Router
        const locals = {
            title: `BotShu V${process.env.npm_package_version}`,
            isStreamLive: botshu.modules.stream.isStreamLive,
        };

        /* GET home page. */
        router.get("/", function (req, res, next) {
            res.render("index", locals);
        });

        return router;
    },
};
