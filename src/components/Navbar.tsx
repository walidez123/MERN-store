import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShoppingCart, Sun, Moon, User, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { AppDispatch, RootState } from '../store/store';
import { toggleTheme } from '../store/slices/themeSlice';
import { checkAuth, getFavorites } from '../store/slices/authSlice';
import { getCart } from '../store/slices/cartSlice';

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { totalItems } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if ( !user) {
      dispatch(checkAuth());
      dispatch(getFavorites());
      dispatch(getCart())
    }
  }, [ dispatch]);
  
  return (
    <nav className="fixed w-full z-50 glass-effect shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <ShoppingBag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ShopHub</h1>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? (
                <Sun size={22} className="text-yellow-500" />
              ) : (
                <Moon size={22} className="text-blue-600" />
              )}
            </motion.button>

            <Link to="/cart" className="relative p-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ShoppingCart size={22} className="text-gray-600 dark:text-gray-300" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link 
                    to="/dashboard" 
                    className="flex items-center space-x-1 p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <LayoutDashboard size={22} />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                )}
                <Link to="/account">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2"
                  >
                    <User size={22} className="text-gray-600 dark:text-gray-300" />
                  </motion.div>
                </Link>
              </div>
            ) : (
              <Link 
                to="/login"
                className="primary-button px-6 py-2 rounded-full font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}