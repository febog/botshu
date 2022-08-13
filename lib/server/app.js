// Creates a minimal Express.js server to respond to pings made to the App
// Service.
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

const indexRouter = require("./routes/index");
const queueRouter = require("./routes/queue");
const rankRouter = require("./routes/rank");

module.exports = {
    /**
     * Starts basic server using Express.js with the given version number as
     * part of the response.
     * @param {Object} store Bot state.
     */
    initializeBotServer(store) {
        // view engine setup
        app.set("views", path.join(__dirname, "views"));
        app.set("view engine", "pug");

        app.use("/", indexRouter.getRouter(store));
        app.use("/queue", queueRouter.getRouter(store));
        app.use("/rank", rankRouter.getRouter());

        app.listen(port);
    },
};
