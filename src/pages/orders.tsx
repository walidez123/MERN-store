import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Package, Search } from "lucide-react";
import { RootState } from "../store/store";
import toast from "react-hot-toast";
import { getCurrentUserOrders, getOrders, updateOrderStatus } from "../store/slices/orderSlice";

export default function UserOrders() {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { orders } = useSelector((state: RootState) => state.order);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCurrentUserOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter((order) => {
    const userName = order.user?.name || "";
    const matchesSearch =
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order._id.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId ,status) => {
    let newStatus = "cancelled"
    if (window.confirm("Are you sure you want to cancel this order?")) {
      newStatus = "cancelled";
    } else {
      newStatus = "pending";
    }
    if(status === "shipped") {
        return toast.error("sorry you cant cancel a shipped order")
    }
    if(status === "cancelled") {
        return toast.error("sorry order aleady cancelled")
    }
    try {
      const response = await dispatch(
        updateOrderStatus({ orderId, status: newStatus })
      );
      if (response.meta.requestStatus === "fulfilled") {
        toast.success("order cancelled!");
      }
    } catch (error) {
      toast.error("Failed to failed to cancel order");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  if (!orders) {
    return <p>No orders found</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Orders</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-800 border-gray-200"
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`px-4 py-2 rounded-lg ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-gray-800 border-gray-200"
          } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order, index) => (
          <motion.div
            key={order._id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`${
              darkMode ? "bg-gray-800 text-white" : "bg-white"
            } rounded-lg shadow-lg p-6`}
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <Package size={24} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Order #{index + 1}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Customer name: {order.user?.name || "Unknown User"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Order ID: {order._id}
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
                <button
                  onClick={() => handleStatusChange(order._id , order.status)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none"
                >
                  Cancel Order
                </button>
              </div>
            </div>
            <div className="mt-4 border-t pt-4 dark:border-gray-700">
              <h4 className="font-medium mb-2">Order Items</h4>
              {order.items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
