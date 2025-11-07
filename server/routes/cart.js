const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/Authentication');
const Cart = require('../model/cartModel');

// Get cart items for a user
router.get('/', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
    res.json(cart || { userId: req.user.id, products: [] });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

// Add product to cart
router.post('/', authenticate, async (req, res) => {
  try {
    console.log("🟡 req.user:", req.user);
    console.log("🟡 req.body:", req.body);

    const { productId, name, price, filename, quantity = 1 } = req.body;

    if (!productId || !name || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId: req.user.id,
        products: [{ productId, name, price, filename, quantity }]
      });
    } else {
      // Update existing cart
      const existingProduct = cart.products.find(
        (item) => item.productId.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ productId, name, price, filename, quantity });
      }
    }

    await cart.save();
    res.status(201).json({ message: 'Item added to cart', cart });

  } catch (err) {
    console.error("🔴 Add to cart error:", err); // <-- you need this
    res.status(500).json({ message: 'Error adding to cart' });
  }
});


// Update quantity of a product in the cart
router.put('/:productId', authenticate, async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity == null || quantity < 1) {
    return res.status(400).json({ message: 'Invalid quantity' });
  }

  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const product = cart.products.find(
      (item) => item.productId.toString() === productId
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    product.quantity = quantity;
    await cart.save();
    res.json({ message: 'Quantity updated', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error updating quantity' });
  }
});

// Remove a product from cart
router.delete('/:id', authenticate, async (req, res) => {
  console.log(req.params.id); // good for debugging

  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== req.params.id // ✅ fixed here
    );

    await cart.save();
    res.json({ message: 'Product removed', cart });
  } catch (err) {
    console.error("Delete cart error:", err);
    res.status(500).json({ message: 'Error removing product' });
  }
});


// Clear cart
router.delete('/', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = [];
    await cart.save();
    res.json({ message: 'Cart cleared', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing cart' });
  }
});
router.patch("/increase/:productId", authenticate, async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.products.find((p) => p.productId.toString() === productId);
  if (item) {
    item.quantity += 1;
    await cart.save();
    return res.json({ cart });
  }

  return res.status(404).json({ message: "Product not in cart" });
});

router.patch("/decrease/:productId", authenticate, async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.products.find((p) => p.productId.toString() === productId);
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.products = cart.products.filter((p) => p.productId.toString() !== productId);
    }
    await cart.save();
    return res.json({ cart });
  }

  return res.status(404).json({ message: "Product not in cart" });
});


module.exports = router;
