import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bookRoutes from "./routes/book.route.js";

dotenv.config();
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).send("Server is running😄");
});
app.use("/api/books", bookRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection failed:", err));
