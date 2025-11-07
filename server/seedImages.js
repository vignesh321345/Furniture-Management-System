const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const Product = require("./model/imagemodel");
dotenv.config();

// ✅ Change this to your deployed base URL
const BASE_URL = process.env.BASE_URL || "http://localhost:4500";

const uploadFolder = path.join(__dirname, "uploads");

const metadata = {
  "one.jpg":    { title: "Modern Fabric Sofa", tags: "sofas", price: 21999 },
  "two.jpg":    { title: "Scandinavian Coffee Table", tags: "living", price: 6499 },
  "three.jpg":  { title: "Queen Size Storage Bed", tags: "bedroom", price: 32799 },
  "four.jpg":   { title: "Minimalist Bookshelf – 5 Tier", tags: "storage", price: 7200 },
  "five.jpg":   { title: "Outdoor Lounge Chair Set (2 pcs)", tags: "outdoor", price: 13999 },
  "six.jpg":    { title: "Compact Shoe Rack", tags: "living", price: 3499 },
  "seven.jpg":  { title: "Elegant Dressing Table", tags: "outdoor", price: 9999 },
  "eight.jpg":  { title: "Ergonomic Office Chair", tags: "sofas", price: 5499 }
};

const seedImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
console.log("✅ Connected to MongoDB:", mongoose.connection.name);
console.log("🗄 Using database:", mongoose.connection.db.databaseName);


    const files = fs.readdirSync(uploadFolder);

    for (const file of files) {
      const meta = metadata[file];
      if (!meta) {
        console.warn(`⚠️ Skipped ${file} - metadata not found.`);
        continue;
      }

      const imageUrl = `${BASE_URL}/uploads/${file}`;
      const exists = await Product.findOne({ image: imageUrl });
      if (exists) {
        console.log(`🔁 Skipping existing product: ${file}`);
        continue;
      }

      const newProduct = new Product({
        title: meta.title,
        tags: meta.tags,
        price: meta.price,
        image: imageUrl, // ✅ store URL instead of local path
        stock: 10,
        isSold: false
      });

      await newProduct.save();
      console.log(`✅ Inserted: ${file}`);
    }

    await mongoose.connection.close();
    console.log("🚪 Connection closed. Done.");
  } catch (error) {
    console.error("❌ Error seeding images:", error.message);
    process.exit(1);
  }
};

seedImages();
