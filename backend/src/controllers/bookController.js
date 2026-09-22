const mongoose = require("mongoose");
const Book = require("../models/Book");
const { getGridFSBucket } = require("../config/gridfs");

const uploadBookCover = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        message: "Invalid book ID",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Cover image is required",
      });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const bucket = getGridFSBucket();

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", async () => {
      book.coverImage = uploadStream.id;

      await book.save();

      res.status(200).json({
        message: "Book cover uploaded successfully",
        bookId: book._id,
        coverImage: uploadStream.id,
      });
    });

    uploadStream.on("error", (error) => {
      res.status(500).json({
        message: "Failed to upload cover image",
        error: error.message,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to upload cover image",
      error: error.message,
    });
  }
};

const getBookCover = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        message: "Invalid book ID",
      });
    }

    const book = await Book.findById(bookId);

    if (!book || !book.coverImage) {
      return res.status(404).json({
        message: "Book cover not found",
      });
    }

    const bucket = getGridFSBucket();

    const files = await bucket
      .find({ _id: book.coverImage })
      .toArray();

    if (!files.length) {
      return res.status(404).json({
        message: "Cover image not found",
      });
    }

    res.set("Content-Type", files[0].contentType);

    const downloadStream = bucket.openDownloadStream(book.coverImage);

    downloadStream.on("error", () => {
      res.status(404).end();
    });

    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve cover image",
      error: error.message,
    });
  }
};

const getBooks = async (req, res) => {
  try {
    const {
      search,
      category,
      format,
      availability,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Search title, author, or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Format filter
    if (format) {
      query.format = format;
    }

    // Availability filter
    if (availability === "available") {
      query.availableCopies = { $gt: 0 };
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    const [books, totalBooks] = await Promise.all([
      Book.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),

      Book.countDocuments(query),
    ]);

    res.status(200).json({
      books,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalBooks,
        totalPages: Math.ceil(totalBooks / limitNumber),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get books",
      error: error.message,
    });
  }
};

const getBookById = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        message: "Invalid book ID",
      });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get book",
      error: error.message,
    });
  }
};

module.exports = {
  uploadBookCover,
  getBookCover,
  getBooks,
  getBookById,
};