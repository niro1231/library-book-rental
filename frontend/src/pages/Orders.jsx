import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `${API_URL}/api/orders/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        setOrders(data);
      } catch (error) {
        console.error(
          "Failed to fetch orders:",
          error
        );
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h1>My Rental Orders</h1>

      {orders.length === 0 ? (
        <p>No rental orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id}>
            <h3>Order ID: {order._id}</h3>

            <p>
              Order Date:{" "}
              {new Date(
                order.orderDate
              ).toLocaleDateString()}
            </p>

            <p>
              Due Date:{" "}
              {new Date(
                order.dueDate
              ).toLocaleDateString()}
            </p>

            <p>
              Total Fee: Rs. {order.totalFee}
            </p>

            <h4>Books</h4>

            {order.books.map((item, index) => (
              <div key={index}>
                <p>
                  {item.book.title}
                </p>

                <p>
                  Format: {item.format}
                </p>

                <p>
                  Quantity: {item.quantity}
                </p>

                <p>
                  Rental Fee: Rs.{" "}
                  {item.rentalFee}
                </p>
              </div>
            ))}

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;