const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Book = require("../models/Book");
const books = require("./books");

dotenv.config();

const seedBooks = async () => {
  try {
    await connectDB();

    await Book.deleteMany();

    await Book.insertMany(books);

    console.log(`${books.length} books seeded successfully`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding books:", error.message);
    process.exit(1);
  }
};

seedBooks();