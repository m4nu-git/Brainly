import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURL = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;

if (!mongoURL) throw new Error("DATABASE_URL environment variable is not defined");
if (!jwtSecret) throw new Error("JWT_SECRET environment variable is not defined");

mongoose
  .connect(mongoURL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
