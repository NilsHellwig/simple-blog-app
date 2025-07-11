import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import "dotenv/config";
import fs from "fs";

import { postSchema, userSchema } from "./schema.js"

const frontendPort = process.env.FRONTEND_PORT || 5173;

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/blogapp";
const port = process.env.PORT || 3000;

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cors({ origin: `http://localhost:${frontendPort}` }));
app.use("/images", express.static("/mongo_img"));

app.post("/register", async (req, res) => {
    const { username, password, name } = req.body;

    const hashedPassword = bcrypt.hash(password);

    try {
        const user = await User.create({ username, password: hashedPassword, name });
        const token = jwt.sign({ username: user.username, name: user.name }, secretKey, { expiresIn: "3h" });

        res.status(201).json({
            token, user: {
                username: user.username,
                name: user.name
            }
        })
    } catch (e) {
        res.status(400).json({"error": "Username already taken or invalid password."});
    }


})

mongoose.connect(mongoUri).then(() => {
    app.listen(port, () => {
        console.log("Server running")
    })
}).catch((err) => {
    console.log("Error connecting to MongoDB")
})

