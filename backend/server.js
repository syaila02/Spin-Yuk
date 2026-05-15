require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const session = require("express-session");
const { Server } = require("socket.io");

const db = require("./database");
const passport = require("./googleAuth");

const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/room");
const spinnerRoutes = require("./routes/spinner");

const app = express();

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

app.use("/api/auth", authRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/spinner", spinnerRoutes);

app.get("/", (req, res) => {
  res.send("API SQLite + WebSocket + Google OAuth running...");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("spin", ({ roomId, spinnerId }) => {
    const safeRoomId = roomId || 1;
    const safeSpinnerId = spinnerId || 1;

    console.log("🎡 Spin request:", safeRoomId, safeSpinnerId);

    db.get(
      "SELECT * FROM spinners WHERE id = ?",
      [safeSpinnerId],
      (err, spinner) => {
        if (err) {
          console.log("Spinner DB error:", err.message);
          return;
        }

        if (!spinner) {
          console.log("Spinner not found");
          return;
        }

        const items = JSON.parse(spinner.items);
        const result = items[Math.floor(Math.random() * items.length)];

        db.run(
          "UPDATE spinners SET lastResult = ? WHERE id = ?",
          [result, safeSpinnerId],
          function (err) {
            if (err) {
              console.log("Update spinner error:", err.message);
              return;
            }

            db.run(
              "INSERT INTO spin_history (spinnerId, roomId, result, createdAt) VALUES (?, ?, ?, ?)",
              [safeSpinnerId, safeRoomId, result, new Date().toISOString()],
              (historyErr) => {
                if (historyErr) {
                  console.log("History error:", historyErr.message);
                } else {
                  console.log("📜 History saved");
                }
              }
            );

            console.log("✅ Result:", result);
            io.to(safeRoomId).emit("spinResult", result);
          }
        );
      }
    );
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});