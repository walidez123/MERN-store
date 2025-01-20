import Cart from '../models/cart.model.js';

// Improved cart functions

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.product._id.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.params; // Use productId instead of itemId
  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user: req.userId });

    // Filter out the item with the given productId
    cart.items = cart.items.filter(item => item.product._id.toString() !== productId);
    
    // Save the updated cart
    await cart.save();
    await cart.populate('items.product');
    
    // Respond with the updated cart
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};