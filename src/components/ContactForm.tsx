import React, { useState } from "react";
import { Send } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { createMessage } from "../store/slices/messageSlice"; // Import the createMessage action
import toast from "react-hot-toast";

export default function ContactForm() {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();

  // Local state for form fields
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Dispatch the createMessage action
      const response = await dispatch(createMessage(form)).unwrap();

      // Handle success
      setStatus("success");
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", message: "" }); // Clear the form
    } catch (error) {
      // Handle error
      setStatus("error");
      toast.error(error.message || "Failed to send message.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h3 className="text-lg font-semibold mb-4">Send us a Message</h3>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={`px-4 py-2 rounded-lg ${
            darkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-white border-gray-200"
          } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={`px-4 py-2 rounded-lg ${
            darkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-white border-gray-200"
          } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          required
        />
      </div>

      <textarea
        placeholder="Your Message"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className={`w-full px-4 py-2 rounded-lg ${
          darkMode
            ? "bg-gray-700 border-gray-600"
            : "bg-white border-gray-200"
        } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
        rows={4}
        required
      />

      {/* Status Messages */}
      {status === "success" && (
        <div className="text-green-500 text-sm">Message sent successfully!</div>
      )}
      {status === "error" && (
        <div className="text-red-500 text-sm">Failed to send message. Please try again.</div>
      )}

      <button
        type="submit"
        disabled={status === "loading"} // Disable the button while loading
        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        <Send size={18} />
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}