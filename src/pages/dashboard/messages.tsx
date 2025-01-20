import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Mail, Search, Trash2, Calendar } from "lucide-react";
import { RootState } from "../../store/store";
import {
  fetchMessages,
  deleteMessage,
  fetchMessageById,
} from "../../store/slices/messageSlice"; // Import actions from the slice
import toast from "react-hot-toast";

export default function Messages() {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { messages, message: selectedMessage, loading, error } = useSelector(
    (state: RootState) => state.messages
  );
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");

  // Fetch messages when the component mounts
  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  // Filter messages based on search query
  const filteredMessages = messages.filter(
    (message) =>
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle message deletion
  const handleDeleteMessage = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const response = await dispatch(deleteMessage(id)).unwrap();
        toast.success("Message deleted successfully!");
      } catch (error) {
        toast.error(error.message || "Failed to delete message.");
      }
    }
  };

  // Handle fetching a single message by ID
  const handleSelectMessage = (id: string) => {
    dispatch(fetchMessageById(id));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Messages</h2>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 rounded-lg ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-gray-800 border-gray-200"
          } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>

      {/* Messages List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-4">
          {filteredMessages.map((message) => (
            <motion.div
              key={message._id}
              layout
              onClick={() => handleSelectMessage(message._id)}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } p-4 rounded-lg shadow-lg cursor-pointer ${
                selectedMessage?._id === message._id ? "ring-2 ring-blue-500" : ""
              } ${!message.isRead ? "border-l-4 border-blue-500" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{message.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {message.email}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMessage(message._id);
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-sm mt-2 line-clamp-2">{message.message}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <Calendar size={12} />
                {new Date(message.createdAt).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } p-6 rounded-lg shadow-lg`}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold">{selectedMessage.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {selectedMessage.email}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteMessage(selectedMessage._id)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p>{selectedMessage.message}</p>
              </div>
              <div className="flex items-center gap-2 mt-6 text-sm text-gray-500">
                <Calendar size={16} />
                {new Date(selectedMessage.createdAt).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } p-6 rounded-lg shadow-lg text-center`}
            >
              <Mail size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Message Selected</h3>
              <p className="text-gray-500">Select a message to view its contents</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}