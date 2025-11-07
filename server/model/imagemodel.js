const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  tags: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {   // 👈 Instead of filename/path, store image URL here
    type: String,
    required: true
  },
  stock: {
    type: Number,
    default: 10
  },
  isSold: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Image", imageSchema);
