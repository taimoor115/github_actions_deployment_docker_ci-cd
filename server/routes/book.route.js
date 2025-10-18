import express from "express";
import {
  createBook,
  getBooks,
  deleteBook,
  getBookById,
  updateBook,
} from "../controllers/book.controller.js";

const router = express.Router();

router.post("/", createBook);
router.get("/", getBooks);
router.get("/:id", getBookById);
router.patch("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;
