const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cartController");

const router = express.Router();

router.get("/", protect, getCart);

router.post("/add", protect, addToCart);

router.put("/:itemId", protect, updateCartItem);

router.delete("/:itemId", protect, removeFromCart);

module.exports = router;