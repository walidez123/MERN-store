import mongoose from 'mongoose';
import Product from './product.model.js'; // Ensure the path is correct

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image:{ type: String, required: true}
  },
  { timestamps: true }
);

// Middleware to delete related products before removing the category
categorySchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    // Delete all products that reference this category
    await Product.deleteMany({ category: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
