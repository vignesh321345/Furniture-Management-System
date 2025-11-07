const User = require("../model/userModel");
const Image = require("../model/imagemodel");
const Operations = require("../model/saleModel");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Get all sales
exports.getSales = async (req, res) => {
  try {
    const sales = await Operations.find().populate("id", "name email");
    res.status(200).json(sales);
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  const userId = req.params.id;
  console.log("Incoming role:", role);
  console.log("User ID:", userId);

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();
    res.json({ message: "Role updated", user });
  } catch (error) {
    console.error("Role update failed:", error.message);
    res.status(500).json({ message: "Error updating role", error: error.message });
  }
};


// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch {
    res.status(500).json({ message: "Error deleting user" });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Image.find();
    res.json(products);
  } catch {
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    await Image.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch {
    res.status(500).json({ message: "Error deleting product" });
  }
};

// Get all pending admin requests
exports.getPendingAdmins = async (req, res) => {
  try {
    const pendingAdmins = await User.find({ role: "pending-admin" }).select("-password");
    res.json({ message: "Pending admin requests", users: pendingAdmins });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending requests", error });
  }
};
