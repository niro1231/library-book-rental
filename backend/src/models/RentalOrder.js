const mongoose = require("mongoose");

const rentalItemSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    format: {
      type: String,
      enum: ["Hardcover", "Paperback", "E-Book"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    rentalFee: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const rentalOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    books: {
      type: [rentalItemSchema],
      required: true,
    },

    totalFee: {
      type: Number,
      required: true,
      min: 0,
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "RentalOrder",
  rentalOrderSchema
);