// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "./models/User.js";
import Job from "./models/Job.js";
import Post from "./models/Post.js";
import Reaction from "./models/Reaction.js";
import Comment from "./models/Comment.js";

dotenv.config();

const seed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🌱 Connected to MongoDB");

    // Clear old data
    await Promise.all([
      User.deleteMany({}),
      Job.deleteMany({}),
      Post.deleteMany({}),
      Reaction.deleteMany({}),
      Comment.deleteMany({}),
    ]);
    console.log("🧹 Cleared old data");

    // Insert jobs
    const jobs = await Job.insertMany([
      {
        title: "Retail Associate",
        description: "Works on the sales floor and cash register.",
      },
      {
        title: "Barista",
        description: "Prepares and serves coffee and food items.",
      },
      {
        title: "Call Center Agent",
        description: "Handles incoming and outgoing customer calls.",
      },
      {
        title: "Warehouse Worker",
        description: "Manages inventory, packaging, and logistics.",
      },
    ]);
    console.log("💼 Jobs seeded");

    // Insert users (include an admin)
    const users = await User.insertMany([
      {
        username: "adminuser",
        email: "admin@example.com",
        password: "password123",
        job: jobs[0]._id,
        isAdmin: true,
      },
      {
        username: "johndoe",
        email: "john@example.com",
        password: "password123",
        job: jobs[0]._id,
      },
      {
        username: "janesmith",
        email: "jane@example.com",
        password: "password123",
        job: jobs[1]._id,
      },
      {
        username: "mikebrown",
        email: "mike@example.com",
        password: "password123",
        job: jobs[2]._id,
      },
    ]);
    console.log("👤 Users seeded");

    // Insert posts (including some by admin)
    const posts = await Post.insertMany([
      {
        authorId: users[0]._id, // Admin post
        content:
          "Reminder: Please follow our community guidelines when posting. Thanks!",
        tags: ["announcement", "admin"],
      },
      {
        authorId: users[0]._id, // Admin post
        content: "We just added new features for reactions! Try them out!",
        tags: ["update", "admin"],
      },
      {
        authorId: users[1]._id,
        content:
          "Had a customer today who argued for 20 minutes over a coupon that expired last year.",
        tags: ["customer", "coupon"],
      },
      {
        authorId: users[2]._id,
        content:
          "Spilled milk all over the counter during a rush, and the customer actually helped me clean it up.",
        tags: ["coffee", "customerService"],
      },
      {
        authorId: users[3]._id,
        content:
          "Back-to-back calls from people yelling because they didn’t read their bill. Tough day in the call center.",
        tags: ["callcenter", "angryCustomers"],
      },
    ]);
    console.log("📝 Posts seeded");

    // Add reactions
    const reactions = await Reaction.insertMany([
      { post: posts[2]._id, user: users[2]._id, type: "wow" },
      { post: posts[2]._id, user: users[3]._id, type: "angry" },
      { post: posts[3]._id, user: users[1]._id, type: "love" },
      { post: posts[4]._id, user: users[0]._id, type: "haha" }, // admin reacting
      { post: posts[0]._id, user: users[1]._id, type: "like" }, // reaction on admin post
      { post: posts[1]._id, user: users[3]._id, type: "wow" }, // reaction on admin post
    ]);
    console.log("💬 Reactions seeded");

    // Update reactionCounts for each post
    for (const post of posts) {
      const relatedReactions = reactions.filter((r) => r.post.equals(post._id));
      const counts = relatedReactions.reduce((acc, r) => {
        acc[r.type] = (acc[r.type] || 0) + 1;
        return acc;
      }, {});
      post.reactionCounts = {
        like: counts.like || 0,
        love: counts.love || 0,
        haha: counts.haha || 0,
        wow: counts.wow || 0,
        sad: counts.sad || 0,
        angry: counts.angry || 0,
      };
      await post.save();
    }

    // Insert comments
    const comments = await Comment.insertMany([
      {
        post: posts[0]._id,
        user: users[1]._id,
        content: "Thanks for the reminder, admin!",
      },
      {
        post: posts[0]._id,
        user: users[2]._id,
        content: "Appreciate you keeping the community in check.",
      },
      {
        post: posts[2]._id,
        user: users[3]._id,
        content: "Oh man, that sounds frustrating!",
      },
      {
        post: posts[3]._id,
        user: users[1]._id,
        content: "Glad the customer was helpful at least!",
      },
      {
        post: posts[4]._id,
        user: users[2]._id,
        content: "Call centers are the worst, hang in there.",
      },
    ]);
    console.log("🗨️ Comments seeded");

    // Link comments to posts
    for (const comment of comments) {
      const post = posts.find((p) => p._id.equals(comment.post));
      if (post) {
        post.comments.push(comment._id);
        await post.save();
      }
    }

    console.log(
      "✅ Seeding complete with admin posts, reactions, and comments!",
    );

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
