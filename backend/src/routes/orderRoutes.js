const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  checkout,
  getMyOrders,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/checkout", protect, checkout);

router.get("/my-orders", protect, getMyOrders);

module.exports = router;