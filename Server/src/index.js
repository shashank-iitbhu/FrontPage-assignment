import 'dotenv/config';
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { setupWebSocket, broadcastNewStories } from "./websocket/socket.js";
import { scrapeNewestStories } from "./scraper/scrape.js";

const app = express();

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

setupWebSocket(io);

const SCRAPE_INTERVAL = 5 * 60 * 1000; // Scrape every 5 minutes
const PORT = process.env.PORT || 5000;

// Start periodic scraping and broadcast new stories
setInterval(async () => {
  console.log("Starting periodic scrape...");
  const newStories = await scrapeNewestStories();

  if (newStories.length > 0) {
    console.log(`Broadcasting ${newStories.length} new stories to clients.`);
    broadcastNewStories(io, newStories); // Broadcast new stories via WebSocket
  }
}, SCRAPE_INTERVAL);

// Start the HTTP server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

io.on("connection", async (socket) => {
  console.log("New client connected.");

  // Fetch and send the latest stories on initial connection
  const initialStories = await scrapeNewestStories();
  if (initialStories.length > 0) {
    console.log("Sending initial stories to client:", initialStories);
    socket.emit("newStories", initialStories);
  }

  socket.emit("welcome", "Welcome to Hacker News Real-time Updates!");

  socket.on("disconnect", () => {
    console.log("Client disconnected.");
  });
});
