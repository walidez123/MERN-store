import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {  Heart } from 'lucide-react';
import { Product } from '../types';
import { RootState } from '../store/store';
import { addToFavorites, removeFromFavorites, getFavorites } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { user, favorites = [], error } = useSelector((state: RootState) => state.auth);


  const isFavorite = favorites.some((fav) => fav._id === product._id); // Adjust based on favorites structure
  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error("You must be signed in to add items to favorites!");
      return;
    }

    if (isFavorite) {
      // Remove from favorites
      const response = await dispatch(removeFromFavorites({ productId: product._id }));
      if (response.meta.requestStatus === "fulfilled") {
        toast.success("Product removed from favorites!");
      } else if (error) {
        toast.error(response.payload.msg);
      }
    } else {
      // Add to favorites
      const response = await dispatch(addToFavorites({  productId: product._id }));
      if (response.meta.requestStatus === "fulfilled") {
        toast.success("Product added to favorites!");
      } else if (error) {
        toast.error(response.payload.msg);
      }
    }

    // Refresh the favorites list
    dispatch(getFavorites(user._id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass-effect rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 group"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleFavorite}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-colors"
        >
          <AnimatePresence>
            <motion.div
             
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              />
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <span className="text-lg font-bold">${product.price}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {product.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link to={`/products/${product._id}`}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-4 flex items-center justify-center gap-2 transition-colors duration-200 shadow-lg group"
        >
          
          View Product
        </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}