import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bookRoutes from "./routes/book.route.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/books", bookRoutes);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/bookapp")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err) => console.error("MongoDB connection failed:", err));
