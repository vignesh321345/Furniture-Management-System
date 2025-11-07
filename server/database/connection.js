const mongoose = require('mongoose');
const seedAdmin = require('./seedAdmin');
require('dotenv').config(); // ✅ This is required to load your .env file

const connection = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database connected at:", db.connection.name, "on host:", db.connection.host);
    seedAdmin();
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connection;
