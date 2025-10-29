const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phonenumber: String,
  role: {
  type: String,
  enum: ['user', 'buyer', 'seller', 'admin', 'pending-admin'],
  default: 'user',
},


  isApproved: { type: Boolean, default: true },
  isAdminRequest: { type: Boolean, default: false },
  isGuest: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
