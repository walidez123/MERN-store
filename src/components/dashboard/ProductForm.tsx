import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { RootState } from "../../store/store";
import { createProduct, editProduct } from "../../store/slices/productsSlice";
import toast from "react-hot-toast";

interface ProductFormProps {
  product?: any;
  onClose: () => void;
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { error } = useSelector((state: RootState) => state.products);
  const { categories } = useSelector((state: RootState) => state.category);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    image: product?.image || "",
    category: product?.category || "",
    tags: product?.tags?.join(", ") || "",
    featured: product?.featured || false,
    stock: product?.stock || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    };
    console.log(productData);
    try {
      if (product) {
        const response = await dispatch(
          editProduct({ productId: product._id, productData: productData })
        );
        if (response.meta.requestStatus === "fulfilled") {
          toast.success("product updated successfully!");
        } else if (error) {
          console.log(error, response);
          toast.error(error.message);
        }
      } else {
        const response = await dispatch(createProduct(productData));
        if (response.meta.requestStatus === "fulfilled") {
          toast.success("product added successfully!");
        } else if (error) {
          console.log(error, response);
          toast.error(error.message);
        }
      }
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        } rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              } border ${
                darkMode ? "border-gray-600" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              } border ${
                darkMode ? "border-gray-600" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                } border ${
                  darkMode ? "border-gray-600" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                } border ${
                  darkMode ? "border-gray-600" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              } border ${
                darkMode ? "border-gray-600" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              } border ${
                darkMode ? "border-gray-600" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              } border ${
                darkMode ? "border-gray-600" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="e.g., electronics, wireless, premium"
            />
          </div>

          {/* <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="featured" className="ml-2 text-sm font-medium">
              Featured Product
            </label>
          </div> */}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {product ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
