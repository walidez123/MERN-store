import mongoose from "mongoose";

const { Schema } = mongoose;

// Review Schema
const reviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User who wrote the review
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating from 1 to 5
    comment: { type: String, required: true }, // Review comment
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Product Schema
const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    image: { type: String, required: true },
    tags: { type: [String], required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" }, // Link to Category
    reviews: [reviewSchema], // Array of reviews
  },
  { timestamps: true }
);

// Virtual for average rating (not stored in the database)
productSchema.virtual("averageRating").get(function () {
  if (this.reviews.length === 0) return 0;
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  return (totalRating / this.reviews.length).toFixed(1); // Round to 1 decimal place
});

// Ensure virtual fields are included in toJSON output
productSchema.set("toJSON", { virtuals: true });

const Product = mongoose.model("Product", productSchema);
export default Product;