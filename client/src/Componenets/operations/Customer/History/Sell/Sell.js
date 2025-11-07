import { useEffect, useState } from "react";
import { useToken } from "../../../../../TokenContext";
import "./Sell.css";

function Sell() {
  const { token } = useToken();
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch("http://localhost:4500/api/payment/my-sales", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setSales(data);
      } catch (err) {
        console.error("Failed to fetch sales:", err);
      }
    };

    fetchSales();
  }, [token]);

  return (
    <div className="sell-section">
      <h3>Products Sold</h3>
      {sales.length === 0 ? (
        <p>You haven't sold anything yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Sold To</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, i) =>
              sale.items.map((item, j) => (
                <tr key={`${i}-${j}`}>
                  <td>{item.name}</td>
                  <td>{item.quantity || 1}</td>
                  <td>₹{item.price}</td>
                  <td>{sale.buyer}</td>
                  <td>{new Date(sale.timestamp).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Sell;
