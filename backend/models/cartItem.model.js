import mongoose from 'mongoose';

const { Schema } = mongoose;
const cartItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Link to Product
    quantity: { type: Number, required: true, default: 1 }, // Number of products in the cart
  });
  
  const CartItem = mongoose.model('CartItem', cartItemSchema);
  export default CartItem;
  