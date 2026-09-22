import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";

const API_URL = import.meta.env.VITE_API_URL;

function Books() {
  const [books, setBooks] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [format, setFormat] = useState("");
  const [availability, setAvailability] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBooks = async () => {
    try {
      const params = new URLSearchParams();

      if (search) {
        params.append("search", search);
      }

      if (category) {
        params.append("category", category);
      }

      if (format) {
        params.append("format", format);
      }

      if (availability) {
        params.append("availability", availability);
      }

      params.append("page", page);
      params.append("limit", 10);

      const response = await fetch(
        `${API_URL}/api/books?${params.toString()}`
      );

      const data = await response.json();

      setBooks(data.books);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search, category, format, availability, page]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handleFormatChange = (event) => {
    setFormat(event.target.value);
    setPage(1);
  };

  const handleAvailabilityChange = (event) => {
    setAvailability(event.target.value);
    setPage(1);
  };

  return (
    <div>
      <h1>Library Books</h1>

      <div>
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={handleSearchChange}
        />

        <select value={category} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Academic">Academic</option>
          <option value="Comics">Comics</option>
        </select>

        <select value={format} onChange={handleFormatChange}>
          <option value="">All Formats</option>
          <option value="Hardcover">Hardcover</option>
          <option value="Paperback">Paperback</option>
          <option value="E-Book">E-Book</option>
        </select>

        <select
          value={availability}
          onChange={handleAvailabilityChange}
        >
          <option value="">All Books</option>
          <option value="available">Available</option>
        </select>
      </div>

      <hr />

      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))
      )}

      <div>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span>
          {" "}
          Page {page} of {totalPages}{" "}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Books;