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

// Hash password + set avatar
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    if (!this.avatarUrl) {
      if (this.gender === "male") {
        this.avatarUrl = "https://avatar.iran.liara.run/public/boy";
      } else if (this.gender === "female") {
        this.avatarUrl = "https://avatar.iran.liara.run/public/girl";
      } else {
        this.avatarUrl = "https://avatar.iran.liara.run/public";
      }
    }

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

// Hash password if updated via findOneAndUpdate
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update && update.password) {
    update.password = await bcrypt.hash(update.password, 10);
    this.setUpdate(update);
  }
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
