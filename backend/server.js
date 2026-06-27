import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { unlink } from "fs/promises";
import sharp from "sharp";

import { postSchema, userSchema } from "./schema.js";

const BCRYPT_SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = "3h";

const secretKey = process.env.SECRET_KEY || "SECRET_KEY";
const frontendPort = process.env.FRONTEND_PORT || 5173;

// mongodb://  — protocol
// localhost   — hostname of the MongoDB server
// 27017       — default MongoDB port
// blogapp     — name of the database to use
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/blogapp";
const port = process.env.PORT || 3335;

// === Models ===
const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

// Middleware that protects routes requiring authentication.
// Expects the header: Authorization: Bearer <token>
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token missing" });

  // The header value is "Bearer <token>", so we split on the space and take the second part
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// === App Setup ===
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors({ origin: `http://localhost:${frontendPort}` }));
app.use("/images", express.static("/mongo_img"));

// === AUTH ===
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const user = await User.create({ username, password: hashedPassword });
    const token = jwt.sign({ username: user.username }, secretKey, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res.status(201).json({
      token,
      user: { username: user.username },
    });
  } catch (err) {
    // MongoDB error code 11000 means a unique index constraint was violated
    const message = err.code === 11000 ? "Username already taken" : "Registration failed";
    res.status(400).json({ error: message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ username: user.username }, secretKey, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res.json({ token, user: { username: user.username } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// === POSTS ===
app.get("/posts", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find().sort({ postedAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to load posts" });
  }
});

app.post("/posts", verifyToken, async (req, res) => {
  const { title, description, imageBase64 } = req.body;

  if (!title || !description || !imageBase64) {
    return res.status(400).json({ error: "Title, description, and image are required." });
  }

  // Validates that the upload is a base64 data URL for a PNG or JPG image
  // and extracts the raw base64 data (group 2) from the "data:image/...;base64,..." prefix
  const base64Pattern = /^data:image\/(png|jpg|jpeg);base64,([A-Za-z0-9+/=]+)$/;
  const match = imageBase64.match(base64Pattern);

  if (!match) {
    return res
      .status(400)
      .json({ error: "Invalid image format. Only PNG and JPG base64 images are allowed." });
  }

  const base64Data = match[2];
  const imageBuffer = Buffer.from(base64Data, "base64");

  try {
    // The post is created first so MongoDB auto-generates its _id,
    // which is then used as the image filename to keep them linked
    const post = await Post.create({
      title,
      description,
      author: {
        username: req.user.username,
      },
      postedAt: Date.now(),
    });

    await sharp(imageBuffer)
      .png()
      .toFile(path.join("/mongo_img", `${post._id}.png`));

    const allPosts = await Post.find().sort({ postedAt: -1 });
    res.status(201).json(allPosts);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post." });
  }
});

app.delete("/posts/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Not found" });

    if (post.author.username !== req.user.username) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Post.deleteOne({ _id: post._id });

    // Delete the associated image file; ignore the error if it doesn't exist
    const imagePath = path.join("/mongo_img", `${post._id}.png`);
    await unlink(imagePath).catch(() => {});

    const allPosts = await Post.find().sort({ postedAt: -1 });
    res.json(allPosts);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete post." });
  }
});

// === SERVER START ===
mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
