import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000";

function BookCard({ book }) {
  return (
    <div>
      {book.coverImage && (
        <img
          src={`${API_URL}/api/books/${book._id}/cover`}
          alt={book.title}
          width="150"
        />
      )}

      <h3>{book.title}</h3>

      <p>Author: {book.author}</p>

      <p>Category: {book.category}</p>

      <p>Format: {book.format}</p>

      <p>
        Available copies: {book.availableCopies}
      </p>

      <Link to={`/books/${book._id}`}>
        View Details
      </Link>
    </div>
  );
}

export default BookCard;