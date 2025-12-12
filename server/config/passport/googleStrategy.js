import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { email, name } = extractGoogleProfile(profile);

        // 1. Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
          // 2. Handle Username Uniqueness
          // If "John Doe" exists, make this one "John Doe 1234"
          let newUsername = name;
          const userExists = await User.findOne({ username: newUsername });
          if (userExists) {
            newUsername += ` ${Math.floor(Math.random() * 10000)}`;
          }

          user = await User.create({
            email,
            username: newUsername,
            provider: "google",
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

const extractGoogleProfile = (profile) => ({
  email: profile.emails?.[0]?.value,
  name: profile.displayName,
});

export default passport;
