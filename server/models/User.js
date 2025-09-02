import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
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
  },
  { timestamps: true }
);

// Hash password + set avatar + sync isAdmin
userSchema.pre("save", async function (next) {
  try {
    // hash password if modified
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    // assign default avatar
    if (!this.avatarUrl) {
      if (this.gender === "male") {
        this.avatarUrl = "https://avatar.iran.liara.run/public/boy";
      } else if (this.gender === "female") {
        this.avatarUrl = "https://avatar.iran.liara.run/public/girl";
      } else {
        this.avatarUrl = "https://avatar.iran.liara.run/public";
      }
    }

    // keep isAdmin in sync with role
    this.isAdmin = this.role === "admin";

    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Reset password method
userSchema.methods.resetPassword = async function (newPassword) {
  this.password = await bcrypt.hash(newPassword, 10);
  await this.save();
};

// Handle updates: hash password if updated + sync isAdmin with role
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  // hash password if being updated
  if (update && update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }

  // sync isAdmin with role if role is updated
  if (update && update.role) {
    update.isAdmin = update.role === "admin";
  }

  this.setUpdate(update);
  next();
});

// Transform response (remove sensitive fields)
function removeSensitive(doc, ret) {
  delete ret.password;
  delete ret.__v;
  return ret;
}

userSchema.set("toJSON", { transform: removeSensitive });
userSchema.set("toObject", { transform: removeSensitive });

export default mongoose.model("User", userSchema);
