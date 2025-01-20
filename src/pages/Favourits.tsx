import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { addToCart } from '../store/slices/cartSlice';
import { getFavorites, removeFromFavorites } from '../store/slices/authSlice';
import { Product } from '../types';
import toast from 'react-hot-toast';
import { ShoppingCart, Heart, Trash } from 'lucide-react';

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const { user, favorites = [] } = useSelector((state: RootState) => state.auth);

  // Handle adding a product to the cart
  const handleAddToCart = (productId: string) => {
    if (!user) {
      toast.error("You must be signed in to add items to the cart!");
      return;
    }
    dispatch(addToCart({ productId, quantity: 1 }))
      .then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          toast.success("Product added to your cart!");
        }
        
      })
      .catch((error) => {
        toast.error("Failed to add product to cart.");
      });
  };

  // Handle removing a product from favorites
  const handleRemoveFromFavorites = (productId: string) => {
    if (!user) {
      toast.error("You must be signed in to manage favorites!");

      return;
    }
    dispatch(removeFromFavorites({ userId: user._id, productId }))
      .then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          toast.success("Product removed from favorites!");
        }
        dispatch(getFavorites())
      })
      .catch((error) => {
        toast.error("Failed to remove product from favorites.");
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>
      {favorites.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">Your favorites list is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((product: Product) => (
            <div
              key={product._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => handleRemoveFromFavorites(product._id)}
                  className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                >
                  <Trash className="w-5 h-5 text-red-500" />
                </button>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">${product.price}</span>
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 transition-colors"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;