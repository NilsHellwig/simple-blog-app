import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import "dotenv/config";
import { postSchema, userSchema } from "./schema";

const secretKey = process.env.SECRET_KEY || "SECRET_KEY";
const frontendPort = process.env.FRONTEND_PORT || 5173;
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/blogapp";
const port = process.env.PORT || 3000;

// === Models ===
const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

// Middleware for JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token missing" });

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
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({ origin: `http://localhost:${frontendPort}` }));
app.use(express.json());

// === AUTH ===
app.post("/register", async (req, res) => {
  const { username, password, name } = req.body;
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }
  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, password: hashed, name });

    const token = jwt.sign({ username: user.username, name: user.name }, secretKey, { expiresIn: "3h" });

    res.status(201).json({
      token,
      user: { username: user.username, name: user.name },
    });
  } catch (e) {
    res.status(400).json({ error: "Username already taken" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ username: user.username, name: user.name }, secretKey, { expiresIn: "3h" });

  res.json({
    token,
    user: { username: user.username, name: user.name },
  });
});

// === POSTS ===
app.get("/posts", async (req, res) => {
  const posts = await Post.find().sort({ postedAt: -1 });
  res.json(posts);
});

app.post("/posts", verifyToken, async (req, res) => {
  const { title, description, imageUrl } = req.body;

  const base64Pattern = /^data:image\/(png|jpg|jpeg);base64,[A-Za-z0-9+/=]+$/;

  if (!base64Pattern.test(imageUrl)) {
    return res.status(400).json({ error: "Invalid image format. Only PNG and JPG base64 images are allowed." });
  }

  await Post.create({
    title,
    description,
    imageUrl,
    author: {
      username: req.user.username,
      name: req.user.name,
    },
    postedAt: Math.floor(Date.now() / 1000),
  });

  const allPosts = await Post.find().sort({ postedAt: -1 });
  res.status(201).json(allPosts);
});

app.delete("/posts/:id", verifyToken, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Not found" });

  if (post.author.username !== req.user.username) {
    return res.status(403).json({ error: "Not authorized" });
  }

  await Post.deleteOne({ _id: post._id });

  const allPosts = await Post.find().sort({ postedAt: -1 }); // optionally sorted
  res.status(200).json(allPosts);
});

// === SERVER START ===
mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => console.log("Server running on http://localhost:3000"));
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
