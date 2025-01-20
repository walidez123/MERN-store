import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, KeyRound, MessageSquareDiff } from 'lucide-react';
import { AppDispatch, RootState } from '../store/store';
import { forgotPassword, resetPassword } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
      const response = await dispatch(resetPassword({resetToken:resetCode , newPassword:newPassword}));
      if (response.meta.requestStatus === "fulfilled") {
        toast.success("new password acctivated! please sign in with the new password");
        navigate("/login"); // Redirect to home page
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
              please enter the reset code you recieved and the new password
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">reset code</label>
                <div className="relative">
                  <MessageSquareDiff className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-gray-50 border-gray-200'
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="reset code"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">enter the new password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="passowrd"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-gray-50 border-gray-200'
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleSubmit}
              >
                reset password
              </button>
            </form>
          </>
        
      </motion.div>
    </div>
  );
}