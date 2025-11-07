const jwt = require("jsonwebtoken");
const User = require("../model/userModel"); // ✅ Correct model path

const authorizeAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

    const user = await User.findById(decoded.user.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Confirm fully approved admin
    if (user.role !== "admin" || user.isApproved === false) {
      return res.status(403).json({ message: "Access denied. Only approved admins allowed." });
    }

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    console.error("❌ Admin Auth Error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authorizeAdmin;
