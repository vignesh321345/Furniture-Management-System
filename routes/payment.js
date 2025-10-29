const express = require("express");
const Razorpay = require("razorpay");
const shortid = require("shortid");
const router = express.Router();
const authenticate = require("../middleware/Authentication");
const crypto = require("crypto");
const Payment = require("../model/paymentModel"); // create this model
require("dotenv").config();


console.log("✅ Razorpay ENV Debug:");
console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_SECRET:", process.env.RAZORPAY_SECRET);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});


// Order Creation Route
router.post("/order", authenticate, async (req, res) => {
  try {
    const { amount } = req.body;
    console.log("Received amount from frontend:", amount);

    const parsedAmount = parseInt(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount received" });
    }

    const options = {
      amount: parsedAmount * 100, // Convert to paise
      currency: "INR",
      receipt: shortid.generate(),
    };

    console.log("Creating Razorpay order with:", options);

    const order = await razorpay.orders.create(options);

    console.log("✅ Razorpay order created:", order);
 res.status(200).json({
  id: order.id,
  currency: order.currency,
  amount: order.amount,
});


  } catch (err) {
    console.error("❌ Razorpay Order Creation Failed:");
    console.error("Raw error:", err);
    console.error("Message:", err?.message);
    console.error("Stack:", err?.stack);

    res.status(500).json({ message: "Order creation failed", error: err?.message || "Unknown error" });
  }
});



// Verify Payment Route
router.post("/verify", authenticate, async (req, res) => {
  const {
    payment_id,
    order_id,
    signature,
    cartItems,
    amount,
  } = req.body;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(order_id + "|" + payment_id)
    .digest("hex");

  if (generatedSignature !== signature) {
    return res.status(400).json({ error: "Invalid signature, verification failed" });
  }

  try {
    // Add sellerId to each cart item if missing
    const enrichedCart = cartItems.map(item => ({
      ...item,
      sellerId: item.sellerId || item.seller, // fallback if 'seller' used earlier
    }));

    const newPayment = new Payment({
      userId: req.user.id,
      orderId: order_id,
      paymentId: payment_id,
      signature: signature,
      cartItems: enrichedCart,
      amount,
      timestamp: new Date(),
    });

    await newPayment.save();
    res.status(200).json({ message: "Payment verified and saved successfully" });
  } catch (err) {
    console.error("Payment verification save error:", err);
    res.status(500).json({ error: "Internal server error while saving payment" });
  }
});

router.get("/my-orders", authenticate, async (req, res) => {
  try {
    const orders = await Payment.find({ userId: req.user.id }).sort({ timestamp: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});
router.get("/my-sales", authenticate, async (req, res) => {
  try {
    const sales = await Payment.find({}).populate("userId"); // Optional if you want buyer info
    const userId = req.user.id;

    // Filter items in each sale where the current user is the seller
    const mySales = [];

    for (const sale of sales) {
      const soldItems = sale.cartItems.filter((item) => item.sellerId === userId);

      if (soldItems.length > 0) {
        mySales.push({
          buyer: sale.userId.name,
          buyerId: sale.userId._id,
          timestamp: sale.timestamp,
          items: soldItems,
        });
      }
    }

    res.status(200).json(mySales);
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(500).json({ error: "Failed to fetch sales" });
  }
});

module.exports = router;
