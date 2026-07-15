import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 6,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
  },
});

export const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], default: [] },
  author: {
    username: { type: String, required: true },
  },
  postedAt: { type: Number, required: true },
});
