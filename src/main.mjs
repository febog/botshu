//   ____        _    _____ _           
//  |  _ \      | |  / ____| |          
//  | |_) | ___ | |_| (___ | |__  _   _ 
//  |  _ < / _ \| __|\___ \| '_ \| | | |
//  | |_) | (_) | |_ ____) | | | | |_| |
//  |____/ \___/ \__|_____/|_| |_|\__,_|
//
// Copyright (c) 2021 - 2026 Felipe Bojorquez

import path from "path";
import { loadEnvFile } from "node:process";
loadEnvFile();

console.log(process.env.TWITCH_USER_ID_MODSHU);

import BotShu from "../lib/botshu.js";
import storage from "../lib/storage.js";
import store from "../lib/global-bot-state.js";

import { RefreshingAuthProvider } from "@twurple/auth";
import { ChatClient } from "@twurple/chat";
import { ApiClient } from "@twurple/api";
import { EventSubWsListener } from "@twurple/eventsub-ws";

//////////////////////////

const port = process.env.PORT || 3000;

import express from "express";
const app = express();

import { createServer } from "node:http";
const server = createServer(app);

// Setup socket.io
import { Server as SocketServer } from "socket.io";
const io = new SocketServer(server);

///////////////////////////
// Prepare Twurple authentication provider
const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const authProvider = new RefreshingAuthProvider({
  clientId,
  clientSecret,
  onRefresh: async (userId, newTokenData) =>
    await storage.storeJsonToBlobStorage(
      newTokenData,
      `token.${userId}.json`
    ),
});

const botTokenBlob = `token.${process.env.TWITCH_USER_ID_MODSHU}.json`;
const botTokenData = await storage.readJsonFromBlobStorage(botTokenBlob);
await authProvider.addUserForToken(botTokenData, ["chat"]);
const streamTokenBlob = `token.${process.env.TWITCH_USER_ID_MUSHU}.json`;
const streamTokenData = await storage.readJsonFromBlobStorage(streamTokenBlob);
await authProvider.addUserForToken(streamTokenData);

// Create Twitch API client
const apiClient = new ApiClient({ authProvider });

// Connect to chat
const channels = store.isProduction() ? ["mushu", "febog"] : ["febog"];
const chatClient = new ChatClient({ authProvider, channels });
chatClient.connect();

// Setup WebSocket EventSub listener for listening to stream changes
const listener = new EventSubWsListener({ apiClient });
listener.start();

// Start main application logic
const botShu = new BotShu(chatClient, apiClient, io, listener, storage, store);
await botShu.start();
//////////////////////////////




// Start HTTP server, express app for the bot website and socket.io

// Serve static assets
const STATIC_ASSETS_PATH = path.join(import.meta.dirname, "web", "public");
app.use(express.static(STATIC_ASSETS_PATH));

// Express view engine setup
const VIEWS_PATH = path.join(import.meta.dirname, "web", "views");
app.set("views", VIEWS_PATH);
app.set("view engine", "pug");


import indexRouter from "./web/routes/index.js";
import queueRouter from "./web/routes/queue.js";
import rankRouter from "./web/routes/rank.js";

app.use("/", indexRouter.getRouter(botShu));
app.use("/queue", queueRouter.getRouter(botShu.store));
app.use("/rank", rankRouter.getRouter());

// Add a basic endpoint for showing the current Partner Plus Points
app.get('/partner-plus-points', (req, res) => {
  // res.send(`${botshu.store.state.plusPoints.getCounter()}`);
  res.send(`Sample points response.`);
});



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

