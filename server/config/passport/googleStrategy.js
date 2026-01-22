import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import crypto from "crypto"; // Needed to generate dummy password
import User from "../../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // FIXED: Added '/api' because your server uses app.use('/api/auth', authRoutes)
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { email, name } = extractGoogleProfile(profile);

        // 1. Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
          // 2. Handle Username Uniqueness
          let newUsername = name.replace(/\s+/g, "").toLowerCase(); // Clean spaces
          const userExists = await User.findOne({ username: newUsername });
          if (userExists) {
            newUsername += `-${Math.floor(Math.random() * 10000)}`;
          }

          // 3. Create User
          user = await User.create({
            email,
            username: newUsername,
            name: name, // REQUIRED by your User model
            // REQUIRED by your User model (Generate a random secure password)
            password: crypto.randomBytes(32).toString("hex"),
            provider: "google",
            isVerified: true, // Google emails are verified
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
