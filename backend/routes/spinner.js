const express = require("express");
const router = express.Router();
const db = require("../database");

// SPIN
router.post("/spin/:id", (req, res) => {
  const spinnerId = req.params.id;

  db.get("SELECT * FROM spinners WHERE id = ?", [spinnerId], (err, spinner) => {
    if (err) return res.status(500).json(err.message);
    if (!spinner) return res.status(404).json("Spinner not found");

    const items = JSON.parse(spinner.items);
    const result = items[Math.floor(Math.random() * items.length)];

    db.run(
      "UPDATE spinners SET lastResult = ? WHERE id = ?",
      [result, spinnerId],
      function (err) {
        if (err) return res.status(500).json(err.message);

        res.json({ result });
      }
    );
  });
});

// SAVE HISTORY
router.post("/history", (req, res) => {
  const { result } = req.body;

  db.run(
    "INSERT INTO spin_history (spinnerId, roomId, result, createdAt) VALUES (?, ?, ?, ?)",
    [1, 1, result, new Date().toISOString()],
    function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        historyId: this.lastID,
      });
    }
  );
});

// GET HISTORY
router.get("/history/:roomId", (req, res) => {
  const roomId = req.params.roomId;

  db.all(
    "SELECT * FROM spin_history WHERE roomId = ? ORDER BY id DESC",
    [roomId],
    (err, rows) => {
      if (err) {
        return res.status(500).json(err.message);
      }

      res.json(rows);
    }
  );
});

module.exports = router;