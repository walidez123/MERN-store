import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import { isValidObjectId } from "mongoose";

// Create a new product
export const createProduct = async (req, res) => {
  const { name, description, price, stock, category,image,tags } = req.body;
  const existedCategory = await Category.findById(category);
  if (!existedCategory) {
    return res.status(400).json({ message: "Invalid category" });
  }
  try {
    const newProduct = new Product({ name, description, price, stock, category,image,tags });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: "Product not found" });
  }
};

// Delete product by ID
export const deleteProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit product
export const editProduct = async (req, res) => {
  const { name, description, price, stock, category,image,tags } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (category) {
      const existedCategory = await Category.findById(category);
      if (!existedCategory) {
        return res.status(400).json({ message: "Invalid category" });
      }
      product.category = category;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.image = image || product.image;
    product.tags = tags || product.tags;

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a review to a product
export const addReview = async (req, res) => {
  const { productId } = req.params;
  const { userId, rating, comment } = req.body;

  if (!isValidObjectId(productId) || !isValidObjectId(userId)) {
    return res.status(400).json({ msg: "Invalid product or user ID" });
  }

  if (!rating || !comment) {
    return res.status(400).json({ msg: "Please provide a rating and comment" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Check if the user has already reviewed the product
    const existingReview = product.reviews.find(
      (review) => review.user.toString() === userId
    );
    if (existingReview) {
      return res.status(400).json({ msg: "You have already reviewed this product" });
    }

    // Add the new review
    product.reviews.push({ user: userId, rating, comment });
    await product.save();

    res.status(201).json({ msg: "Review added successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all reviews for a product
export const getReviews = async (req, res) => {
  const { productId } = req.params;

  if (!isValidObjectId(productId)) {
    return res.status(400).json({ msg: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(productId).populate("reviews.user", "name email");
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(200).json({ reviews: product.reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Calculate the average rating for a product
export const getAverageRating = async (req, res) => {
  const { productId } = req.params;

  if (!isValidObjectId(productId)) {
    return res.status(400).json({ msg: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const averageRating = product.averageRating; // Use the virtual field
    res.status(200).json({ averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};