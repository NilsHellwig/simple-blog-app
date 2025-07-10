import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import "dotenv/config";
import fs from "fs";

import { postSchema, userSchema } from "./schema.js"

const frontendPort = process.env.FRONTEND_PORT || 5173;

const mongoUri = process.env.MONGODB_URI || "monogodb://localhost:27017/blogapp";
const port = process.env.PORT || 3000;

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cors({ origin: `http://localhost:${frontendPort}` }));
app.use("/images", express.static("/mongo_img"));

mongoose.connect(mongoUri).then(() => {
    app.listen(port, () => {
        console.log("Server running")
    })
}).catch((err) => {
    console.log("Error connecting to MongoDB")
})

