import Cart from '../models/cart.model.js';
import Order from '../models/order.model.js';

// Create a new order
export const createOrderFromCart = async (req, res) => {
  const { shippingAddress, phoneNumber, cash } = req.body;

  try {
    // Fetch the user's cart and populate product details
    const cart = await Cart.findOne({ user: req.userId }).populate({
      path: "items.product",
      select: "name price",
    });

    // If the cart is empty or does not exist
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Create a new order from the populated cart items
    const items = cart.items.map(item => {
      if (!item.product) {
        throw new Error("Product details missing for one or more items in the cart.");
      }
      return {
        name: item.product.name,    // Use the product name from the populated cart
        price: item.product.price,  // Use the product price
        quantity: item.quantity,    // Use the quantity from the cart
      };
    });

    // Calculate total price
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create a new order
    const order = new Order({
      user: req.userId,
      items: items,             // Assign the simplified items to the order
      totalPrice: totalPrice,
      shippingAddress: shippingAddress,
      phoneNumber: phoneNumber,
      cash: cash,
    });

    // Save the order
    await order.save();

    // Clear the cart after the order is placed
    cart.items = [];
    await cart.save();

    // Respond with the newly created order, including populated user information
    const populatedOrder = await Order.findById(order._id).populate("user");

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user orders
export const getCurrentUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('user')


    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
     .populate('user')
    

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user')
      .populate({
        path: 'items.product',   // Populate the product field inside orderItems
        select: 'name price description'  // Specify the product fields to return
      });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch the order' });
  }
};
// Order controller (order.controller.js)


// Delete an order by ID
export const deleteOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order belongs to the authenticated user
    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this order' });
    }

    // Delete the order
    await order.remove();

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update order status
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    // Validate the status
    const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order status
    order.status = status;
    await order.save();

    // Respond with the updated order
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};