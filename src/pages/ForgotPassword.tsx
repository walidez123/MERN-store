import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import { AppDispatch, RootState } from '../store/store';
import { forgotPassword } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const [email, setEmail] = useState('');
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
      const response = await dispatch(forgotPassword({email: email}));
      if (response.meta.requestStatus === "fulfilled") {
        toast.success("code sent to your email");
        navigate("/reset-password"); // Redirect to home page
      } else if (error) {
        toast.error(response.payload.msg);
      }
      
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        } p-8 rounded-lg shadow-lg max-w-md w-full`}
      >
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Login
        </Link>

        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
        
        
          <>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error.msg}
              </div>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-gray-50 border-gray-200'
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleSubmit}
              >
                Send reset code
              </button>
            </form>
          </>
        
      </motion.div>
    </div>
  );
}