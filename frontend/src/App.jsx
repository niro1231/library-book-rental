import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";

import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

function Navigation() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <nav>
      <Link to="/">Books</Link>{" | "}
      <Link to="/cart">Cart</Link>{" | "}
      <Link to="/orders">My Orders</Link>{" | "}
      {!token ? (
        <>
          <Link to="/register">Register</Link>{" | "}
          <Link to="/login">Login</Link>
        </>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />

      <Routes>
        <Route path="/" element={<Books />} />

        <Route
          path="/books/:bookId"
          element={<BookDetails />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;