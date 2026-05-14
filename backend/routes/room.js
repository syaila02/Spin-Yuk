const express = require("express");
const router = express.Router();
const db = require("../database");

// ⬇️ middleware auth
const auth = require("../middleware/auth");

// ==========================
// CREATE ROOM (PROTECTED)
// ==========================
router.post("/create", auth, (req, res) => {
  const { name } = req.body;

  // ambil user dari token
  const userId = req.user.id;

  if (!name) {
    return res.status(400).json("Room name required");
  }

  db.run(
    "INSERT INTO rooms (name, owner) VALUES (?, ?)",
    [name, userId],
    function (err) {
      if (err) return res.status(400).json(err.message);

      res.json({
        message: "Room created",
        roomId: this.lastID,
      });
    }
  );
});


// ==========================
// GET ALL ROOMS
// ==========================
router.get("/", (req, res) => {
  db.all("SELECT * FROM rooms", [], (err, rows) => {
    if (err) return res.status(500).json(err.message);

    res.json(rows);
  });
});


// ==========================
// GET ROOM BY ID
// ==========================
router.get("/:id", (req, res) => {
  const roomId = req.params.id;

  db.get("SELECT * FROM rooms WHERE id = ?", [roomId], (err, row) => {
    if (err) return res.status(500).json(err.message);

    if (!row) return res.status(404).json("Room not found");

    res.json(row);
  });
});


// ==========================
// DELETE ROOM (OPTIONAL)
// ==========================
router.delete("/:id", auth, (req, res) => {
  const roomId = req.params.id;

  db.run("DELETE FROM rooms WHERE id = ?", [roomId], function (err) {
    if (err) return res.status(500).json(err.message);

    res.json({ message: "Room deleted" });
  });
});

module.exports = router;