const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const dotenv = require("dotenv");

dotenv.config();
// Use environment variables or hardcode for development
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*", // Allow frontend to connect (set the specific URL in production)
  },
});

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      user: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
