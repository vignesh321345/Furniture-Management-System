const express = require('express');
const app = express();
const env = require('dotenv').config();
const connection = require('./database/connection');
const cors = require('cors');
const ErrorHandler = require('./middleware/ErrorHandler');
const upload = require('./middleware/uploadMiddleware');
const Image = require('./model/imagemodel');
const path = require('path');
const fs = require('fs');
const Authentication = require('./middleware/Authentication');

const port = process.env.PORT || 4500;

connection();

app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// ✅ Serve uploads folder at /uploads URL
app.use('/uploads', express.static(uploadDir));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

// Upload route
app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
        const { title, tags, price } = req.body;
        const { path, filename } = req.file;

        // Save file path as relative to /uploads
        const image = new Image({ title, tags, price, path, filename });
        await image.save();
        res.json({ message: "Product uploaded successfully", image });
    } catch (error) {
        res.status(500).json({ message: "Unable to upload product", error });
    }
});

// Fetch all images/products
app.get("/api/imgs", async (req, res) => {
    try {
        const products = await Image.find();
        res.json({ products });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products", error });
    }
});

// Other routes
app.use("/api/user", require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use("/api", require('./routes/roleRoutes'));
app.use('/api/favourites', require('./routes/fav')); 
app.use('/api/cart', require('./routes/cart'));
app.use("/api/payment", require("./routes/payment"));

// Error handling middleware
app.use(ErrorHandler);

const User = require("./model/userModel");
const bcrypt = require("bcryptjs");

// Start server
app.listen(port, (err) => {
    if (err) console.log(err);
    console.log("Server listening at port number: " + port);
});
