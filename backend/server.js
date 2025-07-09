import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

import { postSchema, userSchema } from "./schema.js";

const secretKey = process.env.SECRET_KEY || "SECRET_KEY";
const frontendPort = process.env.FRONTEND_PORT || 5173;

/*
| Part         | Meaning                                                                      |
| ------------ | ---------------------------------------------------------------------------- |
| `mongodb://` | Protocol schema (ähnlich wie http, https) – indicates that this is a MongoDB connection               |
| `localhost`  | Hostname – the MongoDB server runs on the **local machine**                 |
| `27017`      | Default port – MongoDB listens on port **27017** by default                 |
| `blogapp`    | Database name – this is the **target database** you want to work with       |

*/
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/blogapp";
const port = process.env.PORT || 3000;

// === Models ===
const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

// === App Setup ===
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({ origin: `http://localhost:${frontendPort}` }));
app.use(express.json());
app.use("/images", express.static("/mongo_img"));

// Middleware for JWT

// 🔷 Alternative Schemas im Authorization-Header
// Schema	Beispiel	Bedeutung
// Basic	Basic dXNlcjpwYXNzd29yZA==	Base64-encoded username:password.
// Bearer	Bearer eyJhbGciOiJIUzI1NiIs...	Ein Token, wer es hat, ist authentifiziert.
// Digest	Digest username="Mufasa", realm="...", ...	Komplexere Challenge-Response Authentifizierung.

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

// === SERVER START ===
mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => console.log("Server running on http://localhost:3000"));
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
