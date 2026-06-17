import express from "express";
import cors from "cors";
import "./config/db";
import userRoutes from "./routes/user.routes";
import contentRoutes from "./routes/content.routes";
import brainRoutes from "./routes/brain.routes";
import tagRoutes from "./routes/tag.routes";
import { errorHandler } from "./middleware/error";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1", userRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/brain", brainRoutes);
app.use("/api/v1/tags", tagRoutes);

app.use(errorHandler);

app.listen(3000, () => console.log("Server running on port 3000"));
