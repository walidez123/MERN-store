import mongoose from 'mongoose';

const { Schema } = mongoose; 

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 }, 
      _id: false, 
    },
  ],
}, { 
  timestamps: true, 
  toJSON: { virtuals: true },  // Enable virtuals in JSON output
  toObject: { virtuals: true }  // Enable virtuals in object output
});

// **Virtual for totalPrice**
cartSchema.virtual('totalPrice').get(function() {
  if (!this.items.length) return 0;
  
  return this.items.reduce((acc, item) => {
    if (!item.product || !item.product.price) return acc; 
    return acc + (item.product.price * item.quantity);
  }, 0);
});

cartSchema.pre('save', async function (next) {
  if (!this.isModified('items')) return next(); 

  const productUpdates = this.items.map(async (item) => {
    const product = await mongoose.model('Product').findById(item.product);
    if (product) {
      product.stock -= item.quantity;
      await product.save();
    }
  });

  await Promise.all(productUpdates);
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
