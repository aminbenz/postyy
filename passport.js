const passport = require("passport");
const User = require("./models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config()

passport.use(
   new GoogleStrategy(
      {
         clientID:
           process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, cb) => {
         console.log(profile);
      }
   )
);
passport.serializeUser((user, done) => {
   done(null, user.id);
});

passport.deserializeUser((id, done) => {
   User.findById(id, (err, user) => done(err, user));
});
