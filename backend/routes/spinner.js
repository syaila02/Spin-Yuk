const express = require("express");
const router = express.Router();
const db = require("../database");

// CREATE SPINNER
router.post("/spin/:id", (req, res) => {
  const spinnerId = req.params.id;

  db.get("SELECT * FROM spinners WHERE id = ?", [spinnerId], (err, spinner) => {
    if (err) return res.status(500).json(err.message);

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

module.exports = router;