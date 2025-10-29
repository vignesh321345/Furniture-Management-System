const express = require('express');
const router = express.Router();
const { sale, postCart, getCart, deleteCart } = require("../controller/roleController");
const Authentication = require('../middleware/Authentication');
const upload = require('../middleware/uploadMiddleware');
const asyncHandler = require('express-async-handler');
const Operations = require('../model/saleModel');

router.route('/sale').get(asyncHandler(async (req, res) => {
    const products = await Operations.find();
    res.status(200).json(products);
}));

// Protect all routes
router.use(Authentication);

// POST route (already present)
router.route('/sale').post(upload.single('image'), sale);

// ✅ Add this GET route to fetch products for the logged-in user

router.route('/addCart').post(postCart);
router.route('/getCart').get(getCart);
router.route('/:id').delete(deleteCart);

module.exports = router;
