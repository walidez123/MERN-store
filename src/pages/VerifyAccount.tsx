import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { RootState } from '../store/store';

export default function VerifyAccount() {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (resendTimer > 0 && !canResend) {
      const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [resendTimer, canResend]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (verificationCode === '123456') {
        setIsVerified(true);
        setError('');
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify code. Please try again.');
    }
  };

  const handleResendCode = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCanResend(false);
      setResendTimer(30);
      // Show success message
    } catch (err) {
      setError('Failed to resend code. Please try again.');
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
        <h2 className="text-2xl font-bold mb-6">Verify Your Account</h2>

        {isVerified ? (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex justify-center mb-4"
            >
              <CheckCircle className="text-green-500" size={48} />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">Account Verified!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Your account has been successfully verified.
            </p>
            <Link
              to="/login"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Continue to Login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
                <XCircle size={20} />
                {error}
              </div>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Please enter the 6-digit verification code sent to your email.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between gap-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-12 text-center text-xl rounded-lg ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-gray-50 border-gray-200'
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Verify Account
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendCode}
                disabled={!canResend}
                className={`inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 ${
                  !canResend && 'opacity-50 cursor-not-allowed'
                }`}
              >
                <RefreshCw size={16} className={canResend ? 'animate-spin' : ''} />
                {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}