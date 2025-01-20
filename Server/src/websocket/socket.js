import { pool } from "../config/db.js";

/**
 * Sets up WebSocket (Socket.io) event handlers
 * @param {Server} io - The Socket.io server instance
 */
export const setupWebSocket = (io) => {
  io.on("connection", async (socket) => {
    console.log("New client connected.");

    try {
      const [result] = await pool.query(
        `SELECT COUNT(*) AS count FROM stories WHERE created_at >= NOW() - INTERVAL 5 MINUTE`
      );
      const count = result[0].count;
      socket.emit("initial_count", { count }); // Send initial count to the client
    } catch (error) {
      console.error("Error fetching initial count:", error.message);
      socket.emit("error", { message: "Unable to fetch initial data." });
    }

    socket.on("disconnect", () => {
      console.log("Client disconnected.");
    });
  });
};

/**
 * Broadcasts new stories to all connected clients
 * @param {Server} io - The Socket.io server instance
 * @param {Array} newStories - Array of new stories
 */
export const broadcastNewStories = (io, newStories) => {
    // console.log(newStories);
    io.emit("newStories", newStories);
  };
