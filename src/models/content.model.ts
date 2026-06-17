import mongoose, { Schema, model } from "mongoose";

const ContentSchema = new Schema({
  title: String,
  link: String,
  type: String,
  content: { type: String, default: "" },
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

export const ContentModel = model("Content", ContentSchema);
