import Category from "../models/category.model.js";
// Create a new category
export const createCategory = async (req, res) => {
  const { name, description,image } = req.body;
  const category = await Category.findOne({name:name})
  if (category) return res.status(400).json({ message: 'Category already exists' });
  try {
    const newCategory = new Category({ name, description,image });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).json(category);
  } catch (error) {
    res.status(404).json({ message: 'Category not found' });
  }
};

export const deleteCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Use `deleteOne()` to trigger the `pre('deleteOne')` hook
    await category.deleteOne();

    res.status(200).json({ message: 'Category and associated products deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
