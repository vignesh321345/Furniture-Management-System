const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // your user model
    required: true,
  },
  products: [
    {
      _id: false,
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Image",
      },
      name: String,
      price: Number,
      filename: String,
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
