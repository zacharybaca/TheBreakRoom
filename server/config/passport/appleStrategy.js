import passport from "passport";
import AppleStrategy from "passport-apple";
import crypto from "crypto";
import User from "../../models/User.js";

passport.use(
  new AppleStrategy(
    {
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      privateKeyString: process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      // FIXED: Added '/api' to match server routes
      callbackURL: `${process.env.SERVER_URL}/api/auth/apple/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, idToken, profile, done) => {
      try {
        // Apple puts the email in the idToken usually
        // 'profile' is ONLY present on the very first login!
        const email = profile?.email || idToken?.email;

        if (!email) {
          return done(new Error("No email found from Apple"), null);
        }

        let user = await User.findOne({ email });

        if (!user) {
          // Handle name extraction (First login vs Return login)
          const firstName = profile?.name?.firstName || "Apple";
          const lastName = profile?.name?.lastName || "User";
          const fullName = `${firstName} ${lastName}`;

          let newUsername = `${firstName}${lastName}`.toLowerCase();

          // Basic uniqueness check
          const userExists = await User.findOne({ username: newUsername });
          if (userExists) {
             newUsername += Math.floor(Math.random() * 1000);
          }

          user = await User.create({
            email,
            username: newUsername,
            name: fullName, // REQUIRED by Schema
            password: crypto.randomBytes(32).toString("hex"), // REQUIRED by Schema
            provider: "apple",
            isVerified: true,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);
