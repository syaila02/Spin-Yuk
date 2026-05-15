require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const session = require("express-session");
const { Server } = require("socket.io");

// DATABASE
const db = require("./database");

// GOOGLE AUTH
const passport = require("./googleAuth");

// ROUTES
const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/room");
const spinnerRoutes = require("./routes/spinner");

const app = express();

// ==========================
// MIDDLEWARE
// ==========================
app.use(cors());

app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

// ==========================
// ROUTES
// ==========================
app.use("/api/auth", authRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/spinner", spinnerRoutes);

app.get("/", (req, res) => {
  res.send("API SQLite + WebSocket + Google OAuth running...");
});

// ==========================
// WEBSOCKET
// ==========================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Track users per room
const roomUsers = {};

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // JOIN ROOM
  socket.on("joinRoom", ({ roomId, userName }) => {
    socket.userName = userName;
    socket.join(roomId);

    if (!roomUsers[roomId]) roomUsers[roomId] = [];
    if (!roomUsers[roomId].includes(userName)) {
      roomUsers[roomId].push(userName);
      socket.to(roomId).emit("userJoined", userName);
    }

    console.log(`User ${userName} joined room ${roomId}`);
  });

  // SPIN
  socket.on("spin", ({ roomId, spinnerId }) => {
    console.log("🎡 Spin request:", roomId, spinnerId);

    db.get(
      "SELECT * FROM spinners WHERE id = ?",
      [spinnerId],
      (err, spinner) => {
        if (err) {
          console.log(err.message);
          return;
        }

        if (!spinner) {
          console.log("Spinner not found");
          return;
        }

        const items = JSON.parse(spinner.items);

        // RANDOM
        const result = items[Math.floor(Math.random() * items.length)];

        // SAVE
        db.run(
          "UPDATE spinners SET lastResult = ? WHERE id = ?",
          [result, spinnerId],
          function (err) {
            if (err) {
              console.log(err.message);
              return;
            }

            console.log("✅ Result:", result);

            // EMIT KE ROOM
            io.to(roomId).emit("spinResult", result);
          }
        );
      }
    );
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    // Find and remove user from rooms
    for (const roomId in roomUsers) {
      const index = roomUsers[roomId].indexOf(socket.userName);
      if (index > -1) {
        const userName = roomUsers[roomId][index];
        roomUsers[roomId].splice(index, 1);
        socket.to(roomId).emit("userLeft", userName);
      }
    }
  });
});

// ==========================
// START SERVER
// ==========================
const PORT = 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});