const asyncHandler = require('express-async-handler');
const Operations = require("../model/saleModel");
const Cart = require('../model/cartModel');

const sale = asyncHandler(async (req, res) => {
    const { name, price, date, cal, tag } = req.body;
    let imagePath = req.file ? req.file.path : "";

    if (!name || !price || !tag) {
        res.status(401);
        throw new Error("You can't post a product without necessary details");
    }

    if (cal > 0) {
        await Operations.create({
            name,
            price,
            date,
            cal,
            image: imagePath,
            tag,
            id: req.user.id
        });
    }

    res.status(200).json({ message: "Product posted for sale" });
});

const postCart = asyncHandler(async (req, res) => {
    const { name, price, date } = req.body;
    if (!name || !price) {
        res.status(404);
        throw new Error("All details are necessary");
    }

    const filter = await Cart.findOne({ name, id: req.user.id });
    if (filter) {
        res.status(403);
        throw new Error("Product already found");
    }

    const data = await Cart.create({ name, price, date, id: req.user.id });
    res.status(200).json({ message: "Added to cart", data });
});

const getCart = asyncHandler(async (req, res) => {
    const data = await Cart.find({ id: req.user.id });
    if (!data) {
        res.status(404);
        throw new Error("Data not found");
    }
    res.status(200).json({ data });
});

const deleteCart = asyncHandler(async (req, res) => {
    const data = await Cart.findById(req.params.id);
    if (!data) {
        res.status(404);
        throw new Error("Data is not found to delete");
    }
    if (data.id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("It is forbidden");
    }
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Successfully removed from cart" });
});

module.exports = { sale, postCart, getCart, deleteCart };
