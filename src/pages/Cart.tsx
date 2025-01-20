import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { RootState } from "../store/store";
import { addToCart, getCart, removeFromCart } from "../store/slices/cartSlice";
import toast from "react-hot-toast";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { totalItems, cart, error } = useSelector(
    (state: RootState) => state.cart
  );
   const { user, loading } = useSelector(
      (state: RootState) => state.auth
    );
  const { darkMode } = useSelector((state: RootState) => state.theme);
  useEffect(() => {
    dispatch(getCart());
    
  }, [dispatch]);

  const handleQuantity = async (productId, quantity, itemQuantity) => {
    if (itemQuantity+quantity === 0) {
      handleRemoveFromCart(productId);
    } else {
      const response = await dispatch(
        addToCart({ productId: productId, quantity: quantity })
      );
      if (response.meta.requestStatus === "fulfilled") {
        toast.success("quantity updated!");
        dispatch(getCart());
      } else if (error) {
        toast.error(error.message);
      }
    }
  };
  const handleRemoveFromCart = async (productId) => {
    const response = await dispatch(removeFromCart(productId));
    if (response.meta.requestStatus === "fulfilled") {
      toast.success("item removed!");
      dispatch(getCart());
    } else if (error) {
      toast.error(error.message);
    }
  };

  if (totalItems === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className={`text-center py-16 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-500">
            Start shopping to add items to your cart!
          </p>
        </div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className={`text-center py-16 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          <Link to={'/login'} className="text-2xl underline font-bold mb-4">Please Login First </Link>
          
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1
        className={`text-3xl font-bold mb-8 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.items.map((item) => (
            <motion.div
              key={item.product._id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              } rounded-lg shadow-md p-4 mb-4`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleQuantity(item.product._id, -1, item.quantity)
                    }
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantity(item.product._id, 1)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.product._id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div
            className={`${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            } rounded-lg shadow-md p-6 sticky top-24`}
          >
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
