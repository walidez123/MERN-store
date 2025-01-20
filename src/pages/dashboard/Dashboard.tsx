import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  DollarSign,
  Users,
  TrendingUp,
  Settings as SettingsIcon,
  MessageSquare,
} from "lucide-react";
import { RootState } from "../../store/store";
import Products from "./Products";
import Categories from "./Categories";
import Orders from "./Orders";
import Settings from "./Settings";
import Messages from "./Messages";
import { getCategories } from "../../store/slices/categorySlice";
import { fetchMessages } from "../../store/slices/messageSlice";
import { getOrders } from "../../store/slices/orderSlice";
import { getProducts } from "../../store/slices/productsSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state: RootState) => state.category);
  const { messages } = useSelector((state: RootState) => state.messages);
  const { orders } = useSelector((state: RootState) => state.order);
  const { products } = useSelector((state: RootState) => state.products);
  const { user } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    dispatch(getCategories());
    dispatch(fetchMessages());
    dispatch(getOrders());
    dispatch(getProducts());
  }, [dispatch]);

  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  // Stats data with dynamic values and links
  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      change: "+12%",
      link: "products",
    },
    {
      title: "Total Categories",
      value: categories.length,
      icon: Users,
      change: "+8%",
      link: "categories",
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: DollarSign,
      change: "+23%",
      link: "orders",
    },
    {
      title: "Total Messages",
      value: messages.length,
      icon: MessageSquare,
      change: "+5%",
      link: "messages",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <Products />;
      case "categories":
        return <Categories />;
      case "orders":
        return <Orders />;
      case "messages":
        return <Messages />;
      case "settings":
        return <Settings />;
      default:
        return (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow`}
                  onClick={() => setActiveTab(stat.link)} // Navigate to the respective tab
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon size={24} className="text-blue-500" />
                    <span
                      className={`text-sm ${
                        stat.change.startsWith("+")
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">{stat.value}</h2>
                  <p className="text-gray-500">{stat.title}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`w-64 fixed h-screen ${
            darkMode ? "bg-gray-900" : "bg-gray-100"
          } border-r dark:border-gray-700`}
        >
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Dashboard</h2>
            <nav className="space-y-2">
              {[
                { name: "Overview", value: "overview", icon: TrendingUp },
                { name: "Products", value: "products", icon: Package },
                { name: "Categories", value: "categories", icon: Users },
                { name: "Orders", value: "orders", icon: DollarSign },
                { name: "Messages", value: "messages", icon: MessageSquare },
                { name: "Settings", value: "settings", icon: SettingsIcon },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === item.value
                      ? "bg-blue-600 text-white"
                      : darkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <item.icon size={20} />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1">{renderContent()}</div>
      </div>
    </div>
  );
}