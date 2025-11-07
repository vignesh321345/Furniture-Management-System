const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  items: Array,
  totalAmount: Number,
  razorpay_order_id: String,
  razorpay_payment_id: String,
  status: { type: String, default: "PAID" }
});

module.exports = mongoose.model("Order", orderSchema);
