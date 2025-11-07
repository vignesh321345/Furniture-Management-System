const User = require('../model/userModel'); // 👈 add this line
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
        phonenumber: "9999999999",
        role: "admin"
      });
      console.log("✅ Default admin created");
    }
  } catch (err) {
    console.error("❌ Failed to create default admin:", err);
  }
};

module.exports = seedAdmin;
