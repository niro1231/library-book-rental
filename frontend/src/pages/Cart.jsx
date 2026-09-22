import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Cart() {
    const [cart, setCart] = useState(null);
    const [guestCart, setGuestCart] = useState([]);

    const token = localStorage.getItem("token");

    const fetchCart = async () => {
        try {
            const response = await fetch(`${API_URL}/api/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            setCart(data);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCart();
        } else {
            const savedCart = JSON.parse(
                localStorage.getItem("guestCart") || "[]"
            );

            setGuestCart(savedCart);
        }
    }, [token]);

    const updateQuantity = async (itemId, quantity) => {
        try {
            const response = await fetch(
                `${API_URL}/api/cart/${itemId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        quantity,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            setCart(data.cart);
        } catch (error) {
            console.error("Failed to update cart:", error);
        }
    };

    const removeItem = async (itemId) => {
        try {
            const response = await fetch(
                `${API_URL}/api/cart/${itemId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            setCart(data.cart);
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    const removeGuestItem = (bookId) => {
        const updatedCart = guestCart.filter(
            (item) => item.bookId !== bookId
        );

        setGuestCart(updatedCart);

        localStorage.setItem(
            "guestCart",
            JSON.stringify(updatedCart)
        );
    };

    const handleCheckout = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/orders/checkout`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Checkout successful");

            setCart({
                ...cart,
                items: [],
            });
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Checkout failed");
        }
    };

    if (!token) {
        return (
            <div>
                <h1>Your Cart</h1>

                {guestCart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    guestCart.map((item) => (
                        <div key={item.bookId}>
                            <h3>{item.title}</h3>

                            <p>Format: {item.format}</p>

                            <p>Quantity: {item.quantity}</p>

                            <button
                                onClick={() => removeGuestItem(item.bookId)}
                            >
                                Remove
                            </button>

                            <hr />
                        </div>
                    ))
                )}
            </div>
        );
    }

    if (!cart) {
        return <p>Loading cart...</p>;
    }

    return (
        <div>
            <h1>Your Cart</h1>

            {cart.items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    {cart.items.map((item) => (
                        <div key={item._id}>
                            <h3>{item.book.title}</h3>

                            <p>Author: {item.book.author}</p>

                            <p>Format: {item.format}</p>

                            <p>
                                Available copies:{" "}
                                {item.book.availableCopies}
                            </p>

                            <label>Quantity: </label>

                            <input
                                type="number"
                                min="1"
                                max={item.book.availableCopies}
                                value={item.quantity}
                                onChange={(event) =>
                                    updateQuantity(
                                        item._id,
                                        Number(event.target.value)
                                    )
                                }
                            />

                            <button
                                onClick={() => removeItem(item._id)}
                            >
                                Remove
                            </button>

                            <hr />
                        </div>
                    ))}

                    <button onClick={handleCheckout}>
                        Checkout
                    </button>
                </>
            )}
        </div>
    );
}

export default Cart;