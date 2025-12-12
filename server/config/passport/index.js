import passport from "passport";
import User from "../../models/User.js"; // Import your User model
import "./googleStrategy.js";
import "./appleStrategy.js";

// 1. Serialize: Save just the User ID to the session cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// 2. Deserialize: Take the ID from the cookie and find the full User object
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
