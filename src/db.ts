import mongoose, { Schema, model, mongo } from "mongoose";
import dotenv from "dotenv";

// initialized dotenv
dotenv.config();

const mongoURL = process.env.DATABASE_URL;

if (!mongoURL) {
  throw new Error(`DATABASE_URL environment variable is not defined!`);
}

mongoose
  .connect(mongoURL)
  .then(() => console.log(`Connected to mongoDB`))
  .catch((err) => console.log(`MongoDB connection error:`, err));

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
});

const ContentSchema = new Schema({
  title: String,
  link: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

const LinkSchema = new Schema({
  hash: String,
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

export const ContentModel = model("Content", ContentSchema);
export const UserModel = model("User", UserSchema);
export const LinkModel = model("Links", LinkSchema);
