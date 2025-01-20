import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, MessageCircle } from 'lucide-react';
import { RootState } from '../store/store';
import { addToCart } from '../store/slices/cartSlice';
import { getProductById, addReview, getReviews, getAverageRating } from '../store/slices/productsSlice';
import toast from 'react-hot-toast';
import { addToFavorites, getFavorites, removeFromFavorites } from '../store/slices/authSlice';

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { product, loading, error } = useSelector((state: RootState) => state.products);
  const { user, favorites = [] } = useSelector((state: RootState) => state.auth);

  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Check if the product is in favorites
  const isFavorite = product ? favorites.some((fav) => fav._id === product._id) : false;

  // Fetch product details and reviews on component mount
  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
      dispatch(getReviews(id));
      dispatch(getAverageRating(id));
    }
  }, [dispatch, id]);

  // Handle adding/removing from favorites
  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error("You must be signed in to add items to favorites!");
      return;
    }

    if (isFavorite) {
      // Remove from favorites
      const response = await dispatch(removeFromFavorites({ productId: id }));
      if (response.meta.requestStatus === "fulfilled") {
        toast.success("Product removed from favorites!");
      } else {
        toast.error("Failed to remove product from favorites.");
      }
    } else {
      // Add to favorites
      const response = await dispatch(addToFavorites({ productId: id }));
      if (response.meta.requestStatus === "fulfilled") {
        toast.success("Product added to favorites!");
      } else {
        toast.error("Failed to add product to favorites.");
      }
    }

    // Refresh the favorites list
    dispatch(getFavorites(user._id));
  };

  // Handle adding to cart
  const handleAddToCart = async () => {
    if (!user) {
      toast.error("You must be signed in to add items to the cart!");
      return;
    }
    const response = await dispatch(addToCart({ productId: product._id, quantity: 1 }));
    if (response.meta.requestStatus === "fulfilled") {
      toast.success("Product added to your cart!");
    } else {
      toast.error("Failed to add product to cart.");
    }
  };

  // Handle submitting a review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be signed in to submit a review!");
      return;
    }

    const reviewData = {
      userId: user._id,
      rating: newReview.rating,
      comment: newReview.comment,
    };

    const response = await dispatch(addReview({ productId: product._id, reviewData }));
    if (response.meta.requestStatus === "fulfilled") {
      toast.success("Review submitted successfully!");
      setShowReviewForm(false);
      setNewReview({ rating: 5, comment: '' });
      dispatch(getReviews(product._id)); // Refresh reviews
      dispatch(getAverageRating(product._id)); // Refresh average rating
    } else {
      toast.error("Failed to submit review.");
    }
  };

  // Loading state
  if (loading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  // Error state
  if (error) {
    return <div className="text-center py-16 text-red-500">Error: {error}</div>;
  }

  // Product not found state
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-500">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg shadow-lg object-cover aspect-square"
          />
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-4 right-4 p-3 rounded-full ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
          >
            <Heart className={isFavorite ? 'fill-current' : ''} />
          </button>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= (product.averageRating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {/* ({reviews.length} reviews) */}
              </span>
            </div>
            <p className="text-3xl font-bold text-blue-600">${product.price}</p>
          </div>

          <p className="text-gray-600 dark:text-gray-300">{product.description}</p>

          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
              >
                {tag}
              </span>
            ))}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          {user && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <MessageCircle className="w-5 h-5" />
              Write a Review
            </button>
          )}
        </div>

        {showReviewForm && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmitReview}
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } p-6 rounded-lg shadow-lg mb-8`}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newReview.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Review</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-gray-50 border-gray-200'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className={`px-4 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Submit Review
              </button>
            </div>
          </motion.form>
        )}

        <div className="space-y-6">
          {/* {product.reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } p-6 rounded-lg shadow-lg`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">{review.user?.name || "Anonymous"}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
            </motion.div>
          ))} */}
        </div>
      </div>
    </div>
  );
}