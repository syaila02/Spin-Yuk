require("dotenv").config();

console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);

const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,

      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      callbackURL:
        "http://localhost:5000/api/auth/google/callback",
    },

    (accessToken, refreshToken, profile, done) => {

      const user = {
        id: profile.id,

        name: profile.displayName,

        email: profile.emails?.[0]?.value,
      };

      const token = jwt.sign(
        user,
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      user.token = token;

      return done(null, user);
    }
  )
);

module.exports = passport;