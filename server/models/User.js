import mongoose from "mongoose";
import argon2 from "argon2";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    username: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },

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
    passwordResetToken:{
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
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
    if (this.isModified("password")) {
      // Use Argon2id for new or updated passwords
      this.password = await argon2.hash(this.password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16, // 64 MB
        timeCost: 3,
        parallelism: 1,
      });
    }

    // Default avatar logic
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
    update.password = await argon2.hash(update.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
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
userSchema.methods.comparePassword = async function (candidatePassword) {
  // Supports both Argon2 and old bcrypt hashes
  if (this.password.startsWith("$2")) {
    const bcrypt = await import("bcrypt");
    return bcrypt.compare(candidatePassword, this.password);
  }
  return argon2.verify(this.password, candidatePassword);
};

userSchema.methods.resetPassword = async function (newPassword) {
  this.password = await argon2.hash(newPassword, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });
  await this.save();
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // expire in 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken; // this is the raw token you’ll email
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
