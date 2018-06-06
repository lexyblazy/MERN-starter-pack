const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

const {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
} = require("../config/keys");

passport.use(
  new TwitterStrategy(
    {
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      callbackURL: "/auth/twitter/callback",
      proxy: true
    },
    async (token, tokenSecret, profile, done) => {
      try {
        /*
          before we do create a new twiiter user, we need to be sure
          that user does not exist in our database
        */
        const existingUser = await User.findOne({ twitterId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        //  if no exisiting user,
        const user = new User({
          twitterId: profile.id,
          name: profile.displayName,
          photo: profile.photos[0].value
        });
        await user.save();
        return done(null, user);
      } catch (error) {
        console.log(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const exisitingUser = await User.findOne({ googleId: profile.id });
        if (exisitingUser) {
          return done(null, exisitingUser);
        }
        const user = await new User({
          googleId: profile.id,
          name: profile.displayName,
          photo: profile.photos[0].value,
        }).save();
        return done(null, user);
      } catch (error) {
        console.log("Error => ", error);
      }
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
