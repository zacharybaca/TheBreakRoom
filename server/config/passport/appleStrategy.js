import AppleStrategy from 'passport-apple';

passport.use(
  new AppleStrategy(
    {
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      privateKeyString: process.env.APPLE_PRIVATE_KEY,
      callbackURL: `${process.env.SERVER_URL}/auth/apple/callback`
    },
    async (accessToken, refreshToken, idToken, profile, done) => {
      const email = profile.email;

      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          email,
          provider: 'apple'
        });
      }

      return done(null, user);
    }
  )
);
