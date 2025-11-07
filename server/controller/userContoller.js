const User = require('../model/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const register = asyncHandler(async (req, res) => {
    const { name, email, password, phonenumber, role } = req.body;

    if (!name || !email || !password || !phonenumber) {
        res.status(400);
        throw new Error("All details are necessary");
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
        res.status(403);
        throw new Error("User already exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);

 const user = await User.create({
  name,
  email,
  password: hashPassword,
  phonenumber,
  role: role === "admin" ? "pending-admin" : "user"
});

    const { password: pwd, ...safeUser } = user.toObject();

    res.status(201).json({
        message: "User registered successfully",
        data: safeUser
    });
}); 

// Login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All details are necessary");
    }

    const findUser = await User.findOne({ email });

    const isPasswordValid = findUser && await bcrypt.compare(password, findUser.password);

    if (!isPasswordValid) {
        res.status(401);
        throw new Error("Invalid credentials");
    }

    if (findUser.role === 'pending-admin') {
        res.status(403);
        throw new Error("Admin request not approved yet");
    }

    const token = jwt.sign(
        {
            user: {
                id: findUser._id,
                name: findUser.name,
                email: findUser.email,
                role: findUser.role
            }
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: "50m" }
    );

    res.status(200).json({
        message: "Login successful",
        id: findUser._id,
        token,
        role: findUser.role
    });
});

// Get current user profile
const currentUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    if (req.user.id !== userId && req.user.role !== "admin") {
        res.status(403);
        throw new Error("Access denied: You can only view your own data");
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    res.status(200).json({
        message: "User fetched successfully",
        user
    });
});

module.exports = {
    register,
    login,
    currentUser
};
