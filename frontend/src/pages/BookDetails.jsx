import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function BookDetails() {
  const { bookId } = useParams();

  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/books/${bookId}`
        );

        const data = await response.json();

        setBook(data);
      } catch (error) {
        console.error("Failed to fetch book:", error);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      const existingCart = JSON.parse(
        localStorage.getItem("guestCart") || "[]"
      );

      const existingItem = existingCart.find(
        (item) =>
          item.bookId === book._id &&
          item.format === book.format
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        existingCart.push({
          bookId: book._id,
          title: book.title,
          format: book.format,
          quantity,
        });
      }

      localStorage.setItem(
        "guestCart",
        JSON.stringify(existingCart)
      );

      setMessage("Book added to cart");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId: book._id,
          format: book.format,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setMessage("Book added to cart");
    } catch (error) {
      setMessage("Failed to add book to cart");
    }
  };

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{book.title}</h1>

      {book.coverImage && (
        <img
          src={`${API_URL}/api/books/${book._id}/cover`}
          alt={book.title}
          width="250"
        />
      )}

      <p>
        <strong>Author:</strong> {book.author}
      </p>

      <p>
        <strong>Description:</strong> {book.description}
      </p>

      <p>
        <strong>Category:</strong> {book.category}
      </p>

      <p>
        <strong>Format:</strong> {book.format}
      </p>

      <p>
        <strong>Available copies:</strong>{" "}
        {book.availableCopies}
      </p>

      {book.availableCopies > 0 && (
        <div>
          <label>Quantity: </label>

          <input
            type="number"
            min="1"
            max={book.availableCopies}
            value={quantity}
            onChange={(event) =>
              setQuantity(Number(event.target.value))
            }
          />

          <button onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      )}

      {book.availableCopies === 0 && (
        <p>Currently unavailable</p>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default BookDetails;