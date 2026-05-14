const express = require("express");
const router = express.Router();

const db = require("../database");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const passport = require("../googleAuth");

// ==========================
// REGISTER
// ==========================
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashed],
    function (err) {
      if (err) {
        return res.status(400).json(err.message);
      }

      res.json({
        id: this.lastID,
      });
    }
  );
});

// ==========================
// LOGIN
// ==========================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, user) => {

      if (err) {
        return res.status(500).json(err.message);
      }

      if (!user) {
        return res.status(400).json("User not found");
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return res.status(400).json("Wrong password");
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.json({
        token,
      });
    }
  );
});

// ==========================
// GOOGLE LOGIN
// ==========================
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,

    // BIAR MUNCUL PILIH AKUN
    prompt: "select_account",
  })
);

// ==========================
// GOOGLE CALLBACK
// ==========================
router.get(
  "/google/callback",

  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:3000/login",
  }),

  (req, res) => {

    // REDIRECT KE FRONTEND
    res.redirect(
      `http://localhost:3000/auth/google/callback?token=${req.user.token}`
    );
  }
);

module.exports = router;