import mongoose from "mongoose";

const { Schema } = mongoose;
const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      }
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price must be positive"],
    },
    shippingAddress: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    cash: { type: String, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
