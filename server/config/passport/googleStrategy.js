import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      const { email, name } = extractGoogleProfile(profile);

      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          email,
          username: name,
          provider: 'google'
        });
      }

      return done(null, user);
    }
  )
);

const extractGoogleProfile = (profile) => ({
  email: profile.emails?.[0]?.value,
  name: profile.displayName
});

export default passport;
