import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 6,
    maxlength: 30,
  },
  name: String,
  password: {
    type: String,
    required: true,
  },
});

export const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  author: {
    username: { type: String, required: true },
    name: String,
  },
  postedAt: Number,
});