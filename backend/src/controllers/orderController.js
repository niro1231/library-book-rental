const Cart = require("../models/Cart");
const Book = require("../models/Book");
const RentalOrder = require("../models/RentalOrder");
const User = require("../models/User");
const {
    sendRentalConfirmation,
} = require("../services/emailService");

const RENTAL_FEE = 500;
const RENTAL_DAYS = 14;

const checkout = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.userId,
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty",
            });
        }

        const rentalItems = [];
        let totalFee = 0;

        for (const item of cart.items) {
            const book = await Book.findById(item.book);

            if (!book) {
                return res.status(404).json({
                    message: "Book not found",
                });
            }

            if (item.quantity > book.availableCopies) {
                return res.status(400).json({
                    message: `Not enough copies available for ${book.title}`,
                });
            }

            rentalItems.push({
                book: book._id,
                format: item.format,
                quantity: item.quantity,
                rentalFee: RENTAL_FEE,
            });

            totalFee += RENTAL_FEE * item.quantity;

            book.availableCopies -= item.quantity;

            await book.save();
        }

        const orderDate = new Date();

        const dueDate = new Date(orderDate);

        dueDate.setDate(
            dueDate.getDate() + RENTAL_DAYS
        );

        const order = await RentalOrder.create({
            user: req.userId,
            books: rentalItems,
            totalFee,
            orderDate,
            dueDate,
        });

        const user = await User.findById(req.userId);

        // Populate books before sending the email
        const populatedOrder = await RentalOrder.findById(
            order._id
        ).populate("books.book");

        try {
            await sendRentalConfirmation({
                email: user.email,
                order: populatedOrder,
            });
        } catch (emailError) {
            console.error(
                "Failed to send rental confirmation email:",
                emailError.message
            );
        }

        cart.items = [];

        await cart.save();

        res.status(201).json({
            message: "Checkout successful",
            order: populatedOrder,
        });
    } catch (error) {
        res.status(500).json({
            message: "Checkout failed",
            error: error.message,
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await RentalOrder.find({
            user: req.userId,
        })
            .populate("books.book")
            .sort({ orderDate: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get rental orders",
            error: error.message,
        });
    }
};

module.exports = {
    checkout,
    getMyOrders,
};