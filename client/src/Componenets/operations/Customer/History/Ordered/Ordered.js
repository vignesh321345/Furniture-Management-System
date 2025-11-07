import { useEffect, useState } from "react";
import { useToken } from "../../../../../TokenContext";
import "./Ordered.css"; // Optional CSS file

function Ordered() {
  const [orders, setOrders] = useState([]);
  const { token } = useToken();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(" https://furniture-management-system-1.onrender.com/api/payment/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div className="order-table">
      <h3>Ordered Products</h3>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) =>
              order.cartItems.map((item, index) => (
                <tr key={order._id + index}>
                  <td>{item.name}</td>
                  <td>{item.quantity || 1}</td>
                  <td>₹{item.price}</td>
                  <td>₹{item.price * (item.quantity || 1)}</td>
                  <td>{new Date(order.timestamp).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Ordered;
