require("dotenv").config();
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

async function testRazorpay() {
  try {
    const order = await razorpay.orders.create({
      amount: 1000, // ₹10.00 in paise
      currency: "INR",
      receipt: "receipt_test_123",
    });
    console.log("✅ Order created:", order);
  } catch (error) {
    console.log("❌ Razorpay Order Creation Failed:");
    console.log("Status Code:", error?.statusCode);
    console.log("Error Data:", error?.error);
    console.log("Message:", error?.message);
    console.log("Stack:", error?.stack);
  }
}

testRazorpay();
