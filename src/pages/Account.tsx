import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  LogOut,
  Settings,
  ShieldBan,
  ShieldCheck,
  ShoppingBag,
  User as UserIcon,
} from "lucide-react";
import { RootState } from "../store/store";
import {
  checkAuth,
  getFavorites,
  logout,
  resendCode,
  verifyEmail,
} from "../store/slices/authSlice";
import toast from "react-hot-toast";
import { getCurrentUserOrders, getOrders } from "../store/slices/orderSlice";

export default function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, favorites,loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const { orders } = useSelector((state: RootState) => state.order);
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const [token, setToken] = useState("");
  useEffect(() => {
    dispatch(checkAuth());
    dispatch(getFavorites());
    dispatch(getCurrentUserOrders())
  }, []);
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
    toast.success("Logged out");
  };
  const handleVerifyAcount = async () => {
    const response = await dispatch(verifyEmail({ token: token }));
    if (response.meta.requestStatus === "fulfilled") {
      toast.success("account verified !");
      await dispatch(checkAuth());
    } else if (error) {
      toast.error(response.payload.msg);
    }
  };
  const handleResendCode = async () => {
    const response = await dispatch(resendCode({ email: user.email }));
    if (response.meta.requestStatus === "fulfilled") {
      toast.success("code resent to your email !");
    } else if (error) {
      toast.error(response.payload.msg);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        } rounded-lg shadow-lg p-6`}
      >
        <div className="flex items-center gap-4 mb-8">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <UserIcon size={32} className="text-gray-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to={'/acount/orders'}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${
              darkMode ? "bg-gray-700" : "bg-gray-50"
            } p-6 rounded-lg`}
            >
            <ShoppingBag className="mb-4" size={24} />
            <h2 className="text-lg font-semibold mb-2">Orders</h2>
            <p className="text-gray-500">
              You have {orders.length} orders
            </p>
          </motion.div>
            </Link>
          <Link to={'/acount/favourits'}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${
              darkMode ? "bg-gray-700" : "bg-gray-50"
            } p-6 rounded-lg`}
            >
            <Heart className="mb-4 text-red-500 fill-red-500" size={24} />
            <h2 className="text-lg font-semibold mb-2">Favourits</h2>
            <p className="text-gray-500">
              You have {favorites.length} product in list
            </p>
          </motion.div>
            </Link>

          {user.role === "admin" && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              } p-6 rounded-lg cursor-pointer`}
              onClick={() => navigate("/dashboard")}
            >
              <Settings className="mb-4" size={24} />
              <h2 className="text-lg font-semibold mb-2">Dashboard</h2>
              <p className="text-gray-500">Manage products and orders</p>
            </motion.div>
          )}
          {user.isVerified === true && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              } p-6 rounded-lg cursor-pointer`}
              onClick={() => navigate("/")}
            >
              <ShieldCheck className="mb-4 text-green-600" size={24} />
              <h2 className="text-lg font-semibold mb-2">veryfied</h2>
              <p className="text-gray-500">your account is veryfied</p>
            </motion.div>
          )}
          {user.isVerified === false && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              } p-6 rounded-lg `}
            >
              <ShieldBan className="mb-4 text-red-600" size={24} />
              <h2 className="text-lg font-semibold mb-2">not verified</h2>
              <p className="text-gray-500">
                please enter the code sent to your email
              </p>
              {error && (
                <div className="bg-red-100 border mt-4 border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error.msg}
                </div>
              )}
              <div className="flex flex-col justify-between mt-2">
                <input
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  type="text"
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-gray-200"
                  }  rounded-lg px-4 py-2 `}
                  placeholder="code..."
                />
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleVerifyAcount}
                    className={`${
                      darkMode ? "bg-gray-800" : "bg-gray-200"
                    }  rounded-lg px-4 py-2 opacity-75 hover:opacity-100`}
                  >
                    verify
                  </button>
                  <button
                    onClick={handleResendCode}
                    className={`${
                      darkMode ? "bg-gray-800" : "bg-gray-200"
                    }  rounded-lg px-4 py-2 opacity-75 hover:opacity-100`}
                  >
                    resend code
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${
              darkMode ? "bg-gray-700" : "bg-gray-50"
            } p-6 rounded-lg cursor-pointer`}
            onClick={handleLogout}
          >
            <LogOut className="mb-4" size={24} />
            <h2 className="text-lg font-semibold mb-2">Logout</h2>
            <p className="text-gray-500">Sign out of your account</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
