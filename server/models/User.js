import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    username: { type: String, unique: true, sparse: true }, // optional, unique if present
    email: { type: String, unique: true, sparse: true }, // optional, unique if present

    password: { type: String, required: true, select: false },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    bio: { type: String },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    avatarUrl: { type: String },
    breakrooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Breakroom",
      },
    ],
  },
  { timestamps: true }
);

/**
 * Require at least one identifier (username or email)
 */
userSchema.pre("validate", function (next) {
  if (!this.username && !this.email) {
    this.invalidate("username", "Either username or email is required.");
    this.invalidate("email", "Either username or email is required.");
  }
  next();
});

/**
 * Pre-save hook: hash password, set default avatar, sync isAdmin
 */
userSchema.pre("save", async function (next) {
  try {
    // hash password if modified
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    // set default avatar if none provided
    if (!this.avatarUrl) {
      switch (this.gender) {
        case "male":
          this.avatarUrl = "https://avatar.iran.liara.run/public/boy";
          break;
        case "female":
          this.avatarUrl = "https://avatar.iran.liara.run/public/girl";
          break;
        default:
          this.avatarUrl = "https://avatar.iran.liara.run/public";
      }
    }

    // sync admin status
    this.isAdmin = this.role === "admin";

    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Pre-update hook: hash password & sync isAdmin on updates
 */
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }

  if (update.role) {
    update.isAdmin = update.role === "admin";
  }

  this.setUpdate(update);
  next();
});

/**
 * Instance methods
 */
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.resetPassword = async function (newPassword) {
  this.password = await bcrypt.hash(newPassword, 10);
  await this.save();
};

/**
 * Clean response
 */
function removeSensitive(doc, ret) {
  delete ret.password;
  delete ret.__v;
  return ret;
}

userSchema.set("toJSON", { transform: removeSensitive });
userSchema.set("toObject", { transform: removeSensitive });

export default mongoose.model("User", userSchema);
