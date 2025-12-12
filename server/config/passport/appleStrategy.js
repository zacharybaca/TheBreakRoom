import passport from "passport"; // Was missing
import AppleStrategy from "passport-apple";
import User from "../../models/User.js"; // Was missing

passport.use(
  new AppleStrategy(
    {
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      privateKeyString: process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Common fix for ENV newlines
      callbackURL: `${process.env.SERVER_URL}/auth/apple/callback`,
      passReqToCallback: true, // Important for Apple to get the POST body
    },
    async (req, accessToken, refreshToken, idToken, profile, done) => {
      try {
        // Apple puts the email in the idToken usually, but we check profile too
        // Note: 'profile' is ONLY present on the very first login!
        const email = profile?.email || idToken?.email;

        if (!email) {
           return done(new Error("No email found from Apple"), null);
        }

        let user = await User.findOne({ email });

        if (!user) {
          // Handle the case where Apple didn't send a name (subsequent logins)
          // or fallback to a default
          const name = profile?.name
            ? `${profile.name.firstName} ${profile.name.lastName}`
            : `Apple User ${Date.now()}`;

          user = await User.create({
            email,
            username: name,
            provider: "apple",
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);
