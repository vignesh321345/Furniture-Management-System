const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  filename: String,
  path: String,
  title: String,
  tags: String,
  price: String
});

module.exports = mongoose.model("Image", imageSchema);
