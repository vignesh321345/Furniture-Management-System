import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProfileContext } from '../Customer/ProfileContext.js';
import { useProductContext } from "../ProductContext.js";
import './Cart.css';
import { useToken } from "../../../TokenContext.js";

function Cart() {
  const { status } = useProfileContext();
  const { token } = useToken();
  const {
    cart,
    remove_cart,
    increase_quantity,
    decrease_quantity,
    clear_cart,
  } = useProductContext();

  const [totalCart, setTotalCart] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const totalPrice = cart.reduce((acc, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return acc + price * quantity;
    }, 0);

    const totalCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

    setTotalCart(totalPrice);
    setTotalItems(totalCount);
  }, [cart]);

  const handleCheckout = async () => {
  if (totalCart === 0) {
    alert("🛒 Your cart is empty!");
    return;
  }

  try {
    const res = await fetch(" https://furniture-management-system-3.onrender.com/api/payment/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: totalCart }),
    });

    const data = await res.json();

    console.log("✅ Razorpay Order Received:", data);

    if (!data.id) {
      alert("❌ Failed to create Razorpay order");
      return;
    }

    // Wait for Razorpay script to load
    if (!window.Razorpay) {
      alert("❌ Razorpay SDK not loaded. Check <script> in index.html");
      return;
    }

    const options = {
      key: "rzp_test_dQbQikg1QJYXbG",
      amount: data.amount,
      currency: data.currency,
      name: "Furniture Store",
      description: "Order Payment",
      order_id: data.id,
      handler: async function (response) {
        alert("✅ Payment Successful");

        try {
          await fetch(" https://furniture-management-system-3.onrender.com/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
              cartItems: cart,
              amount: totalCart,
            }),
          });

          clear_cart(); // Clear cart on success
        } catch (verifyErr) {
          console.error("Payment verification failed:", verifyErr);
          alert("⚠️ Payment verified, but saving failed");
        }
      },
      prefill: {
        name: "Vignesh",
        email: "vign@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#0a9396",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    rzp.on('payment.failed', function (response) {
  console.error('❌ Payment failed:', response.error);
  alert('Payment failed: ' + response.error.description);
});

  } catch (err) {
    console.error("Payment error:", err);
    alert("❌ Payment failed");
  }
};


  return status ? (
    <>
      <div className="itemsinCart">
        <div className="totalItems">Total Items: {totalItems}</div>
        <div className="totalPrice">Total Value: ₹{totalCart}</div>
        <button className="clear_cart_btn" onClick={clear_cart}>Clear Cart</button>
      </div>

      {cart.length > 0 ? (
        cart.map((prod) => (
          <div key={prod._id} className="products_container">
            <img src={` https://furniture-management-system-3.onrender.com/${prod.filename}`} alt={prod.name} />
            <div className="products_description">
              <p>{prod.name}</p>
              <p>₹{prod.price}</p>
              <p>Qty: {prod.quantity || 1}</p>

              <div className="qty_buttons">
                <button onClick={() => decrease_quantity(prod)}>-</button>
                <button onClick={() => increase_quantity(prod)}>+</button>
              </div>
            </div>
            <button onClick={() => remove_cart(prod)}>Remove</button>
          </div>
        ))
      ) : (
        <p className="empty">Your cart is empty</p>
      )}

      <Link to="/">
        <button className="home_page">Back To Home</button>
      </Link>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button className="checkout_btn" onClick={handleCheckout}>Proceed to Checkout</button>
      </div>
    </>
  ) : (
    <Navigate to="/login" />
  );
}

export default Cart;
