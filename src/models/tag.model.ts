import mongoose, { Schema, model } from "mongoose";

const TagSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

TagSchema.index({ name: 1, userId: 1 }, { unique: true });

export const TagModel = model("Tag", TagSchema);
