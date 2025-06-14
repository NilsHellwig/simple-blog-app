import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

// MongoDB-Models
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  name: String,
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  author: {
    username: { type: String, required: true },
    name: String,
  },
  postedAt: Number,
});
const Post = mongoose.model("Post", postSchema);

// Middleware für JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token fehlt" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Ungültiges Token" });
  }
};

// App setup
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// === AUTH ===
app.post("/register", async (req, res) => {
  const { username, password, name } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, password: hashed, name });
    res.status(201).json({ message: "Registriert" });
  } catch (e) {
    res.status(400).json({ error: "Nutzername bereits vergeben" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Falsche Zugangsdaten" });
  }

  const token = jwt.sign({ username: user.username, name: user.name }, "SECRET_KEY", { expiresIn: "3h" });

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

  // Regular expression to validate base64 PNG or JPG/JPEG images:
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
  if (!post) return res.status(404).json({ error: "Nicht gefunden" });

  if (post.author.username !== req.user.username) {
    return res.status(403).json({ error: "Nicht erlaubt" });
  }

  await Post.deleteOne({ _id: post._id });

  const allPosts = await Post.find().sort({ postedAt: -1 }); // optional sortiert
  res.status(200).json(allPosts);
});

// === SERVER START ===
mongoose
  .connect("mongodb://localhost:27017/blogapp")
  .then(() => {
    console.log("MongoDB verbunden");
    app.listen(3000, () => console.log("Server läuft auf http://localhost:3000"));
  })
  .catch((err) => console.error("Fehler bei MongoDB-Verbindung:", err));
