const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Book = require("../models/Book");

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.userId,
    }).populate("items.book");

    if (!cart) {
      cart = await Cart.create({
        user: req.userId,
        items: [],
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get cart",
      error: error.message,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { bookId, format, quantity = 1 } = req.body;

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

    if (!["Hardcover", "Paperback", "E-Book"].includes(format)) {
      return res.status(400).json({
        message: "Invalid format",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    if (quantity > book.availableCopies) {
      return res.status(400).json({
        message: "Not enough copies available",
      });
    }

    let cart = await Cart.findOne({
      user: req.userId,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.book.toString() === bookId &&
        item.format === format
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > book.availableCopies) {
        return res.status(400).json({
          message: "Not enough copies available",
        });
      }

      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        book: bookId,
        format,
        quantity,
      });
    }

    await cart.save();

    await cart.populate("items.book");

    res.status(200).json({
      message: "Book added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add book to cart",
      error: error.message,
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        message: "Invalid cart item ID",
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({
      user: req.userId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    const book = await Book.findById(item.book);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    if (quantity > book.availableCopies) {
      return res.status(400).json({
        message: "Not enough copies available",
      });
    }

    item.quantity = quantity;

    await cart.save();

    await cart.populate("items.book");

    res.status(200).json({
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update cart",
      error: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        message: "Invalid cart item ID",
      });
    }

    const cart = await Cart.findOne({
      user: req.userId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    item.deleteOne();

    await cart.save();

    await cart.populate("items.book");

    res.status(200).json({
      message: "Book removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove book from cart",
      error: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};