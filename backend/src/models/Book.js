const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    coverImage: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    category: {
      type: String,
      enum: ["Fiction", "Non-Fiction", "Academic", "Comics"],
      required: true,
    },

    format: {
      type: String,
      enum: ["Hardcover", "Paperback", "E-Book"],
      required: true,
    },

    availableCopies: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);