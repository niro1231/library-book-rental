const express = require("express");

const upload = require("../config/multer");

const {
  uploadBookCover,
  getBookCover,
  getBooks,
  getBookById,
} = require("../controllers/bookController");

const router = express.Router();

// Get all books
router.get("/", getBooks);

// Get one book
router.get("/:bookId", getBookById);

// Get book cover
router.get("/:bookId/cover", getBookCover);

// Upload book cover
router.post(
  "/:bookId/cover",
  upload.single("cover"),
  uploadBookCover
);

module.exports = router;