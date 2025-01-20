import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CreditCard, ChevronRight, Lock } from "lucide-react";
import { RootState } from "../store/store";
import toast from "react-hot-toast";
import { createOrder } from "../store/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import { getCart } from "../store/slices/cartSlice";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createPaymentIntent } from "../store/slices/paymentSlice";

type PaymentMethod = "stripe" | "cash";

export default function Checkout() {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { cart } = useSelector((state: RootState) => state.cart);
  const { error } = useSelector((state: RootState) => state.order);
  const { clientSecret } = useSelector((state: RootState) => state.payment);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [loading, setLoading] = useState(false);
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");

  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!streetAddress || !city || !state || !postalCode || !country || !phone) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // Construct the full address
    const shippingAddress = `${streetAddress}, ${city}, ${state}, ${postalCode}, ${country}`;

    if (paymentMethod === "cash") {
      try {
        const response = await dispatch(
          createOrder({ shippingAddress, phoneNumber: phone, cash: "cash" })
        );
        if (response.meta.requestStatus === "fulfilled") {
          toast.success("Order placed successfully!");
          await dispatch(getCart());
          navigate("/");
        } else if (error) {
          toast.error(error.message);
        }
      } catch (err) {
        toast.error("An error occurred while placing the order.");
      }
      setLoading(false);
    } else if (paymentMethod === "stripe") {
      if (!stripe || !elements) {
        toast.error("Stripe has not loaded yet.");
        setLoading(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        toast.error("Card details are missing.");
        setLoading(false);
        return;
      }
      await dispatch(createPaymentIntent({ totalPrice: cart.totalPrice }));

      try {
        const { paymentIntent, error } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                address: {
                  line1: streetAddress,
                  city: city,
                  state: state,
                  postal_code: postalCode,
                  country: country,
                },
                phone: phone,
              },
            },
          }
        );

        if (error) {
          toast.error(error.message || "Payment failed");
        } else if (paymentIntent?.status === "succeeded") {
          const response = await dispatch(
            createOrder({ shippingAddress, phoneNumber: phone, cash: "stripe" })
          );
          if (response.meta.requestStatus === "fulfilled") {
            toast.success("Payment successful, order placed!");
            await dispatch(getCart());
            navigate("/");
          } else if (error) {
            toast.error(error.message);
          }
        }
      } catch (err) {
        toast.error("Payment failed.");
      }
      setLoading(false);
    }
  };

  if (!cart) {
    return <div>No cart</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div
          className={`${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          } rounded-lg shadow-lg p-6`}
        >
          <h2 className="text-2xl font-bold mb-6">Checkout</h2>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <div className="space-y-3">
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => setPaymentMethod("stripe")}
                className={`flex items-center p-4 rounded-lg cursor-pointer border-2 transition-colors ${
                  paymentMethod === "stripe"
                    ? "border-blue-500"
                    : darkMode
                    ? "border-gray-700"
                    : "border-gray-200"
                }`}
              >
                <div className="flex-1 flex items-center gap-3">
                  <CreditCard className="text-blue-500" size={24} />
                  <div>
                    <p className="font-medium">Credit / Debit Card</p>
                    <p className="text-sm text-gray-500">Powered by Stripe</p>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "stripe"
                      ? "border-blue-500"
                      : darkMode
                      ? "border-gray-700"
                      : "border-gray-300"
                  }`}
                >
                  {paymentMethod === "stripe" && (
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                  )}
                </div>
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => setPaymentMethod("cash")}
                className={`flex items-center p-4 rounded-lg cursor-pointer border-2 transition-colors ${
                  paymentMethod === "cash"
                    ? "border-blue-500"
                    : darkMode
                    ? "border-gray-700"
                    : "border-gray-200"
                }`}
              >
                <div className="flex-1 flex items-center gap-3">
                  <div>
                    <p className="font-medium">Cash</p>
                    <p className="text-sm text-gray-500">Cash on Delivery</p>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "cash"
                      ? "border-blue-500"
                      : darkMode
                      ? "border-gray-700"
                      : "border-gray-300"
                  }`}
                >
                  {paymentMethod === "cash" && (
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Address Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Street Address
              </label>
              <input
                required
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                type="text"
                placeholder="123 Main St"
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                type="text"
                placeholder="City"
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                type="text"
                placeholder="State/Province"
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Postal Code
              </label>
              <input
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                type="text"
                placeholder="Postal Code"
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                type="text"
                placeholder="Country"
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                required
                min={8}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="number"
                placeholder="Phone Number"
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {paymentMethod === "stripe" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Card Info
                </label>
                <CardElement
                  className={`w-full rounded-lg p-4 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-black"
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  Pay ${cart.totalPrice.toFixed(2)}
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Lock size={16} />
            <p>Your payment information is secure</p>
          </div>
        </div>

        {/* Order Summary */}
        <div
          className={`${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          } rounded-lg shadow-lg p-6 h-fit lg:sticky lg:top-24`}
        >
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>

          <div className="space-y-4 mb-6">
            {cart.items.map((item) => (
              <div key={item.product._id} className="flex gap-4">
                <img
                  src={item.product.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}