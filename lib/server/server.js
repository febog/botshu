// Creates a minimal Express.js server to respond to pings made to the App
// Service.
const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
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
        // Serve static assets
        app.use(express.static(path.join(__dirname, 'public')));

        // view engine setup
        app.set("views", path.join(__dirname, "views"));
        app.set("view engine", "pug");

        app.use("/", indexRouter.getRouter(store));
        app.use("/queue", queueRouter.getRouter(store));
        app.use("/rank", rankRouter.getRouter());

        // Setup socket.io
        io.on('connection', (socket) => {
            console.log('A user connected');

            // Example: Send a message to the client when they connect
            socket.emit('message', 'Welcome to the real-time chat!');

            // Handle messages from clients
            socket.on('chat message', (message) => {
                // Broadcast the message to all connected clients
                io.emit('message', message);
            });

            // Handle disconnections
            socket.on('disconnect', () => {
                console.log('A user disconnected');
            });
        });

        server.listen(port);
    },
};
