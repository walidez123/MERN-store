import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { RootState } from "../../store/store";
import { fetchSettings, updateSettings } from "../../store/slices/settingsSlice";
import toast from "react-hot-toast";

export default function Settings() {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { settings: reduxSettings, loading, error } = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();

  // Local state for form fields
  const [settings, setSettings] = React.useState({
    storeName: "",
    storeEmail: "",
    aboutUs: "", // Added aboutUs field
    currency: "",
    taxRate: "",
    shippingFee: "",
    freeShippingThreshold: "",
    logo: "",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
    },
  });

  // Fetch settings when the component mounts
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // Update local state and website title when Redux settings are loaded
  useEffect(() => {
    if (reduxSettings) {
      setSettings({
        storeName: reduxSettings.siteTitle || "",
        storeEmail: reduxSettings.contactEmail || "",
        aboutUs: reduxSettings.aboutUs || "", // Added aboutUs field
        currency: "USD", // Default value (adjust as needed)
        taxRate: "10", // Default value (adjust as needed)
        shippingFee: "15", // Default value (adjust as needed)
        freeShippingThreshold: "100", // Default value (adjust as needed)
        logo: reduxSettings.logoUrl || "",
        socialMedia: {
          facebook: reduxSettings.socialLinks?.facebook || "",
          twitter: reduxSettings.socialLinks?.twitter || "",
          instagram: reduxSettings.socialLinks?.instagram || "",
        },
      });

      // Update the website title
      if (reduxSettings.siteTitle) {
        document.title = reduxSettings.siteTitle;
      }
    }
  }, [reduxSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setSettings((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the data to be sent to the backend
    const updatedSettings = {
      siteTitle: settings.storeName,
      contactEmail: settings.storeEmail,
      aboutUs: settings.aboutUs, // Added aboutUs field
      socialLinks: {
        facebook: settings.socialMedia.facebook,
        twitter: settings.socialMedia.twitter,
        instagram: settings.socialMedia.instagram,
      },
      logoUrl: settings.logo,
      metaDescription: "", // Add if needed
      metaKeywords: [], // Add if needed
    };

    try {
      // Dispatch the updateSettings action and unwrap the result
      const response = await dispatch(updateSettings(updatedSettings)).unwrap();

      // Handle success
      toast.success("Settings updated successfully!");
      console.log("Updated settings:", response);

      // Update the website title
      document.title = settings.storeName;
    } catch (error) {
      // Handle error
      console.error("Failed to update settings:", error);
      toast.error(error.message || "Failed to update settings.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Website Settings</h2>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmit}
        className="space-y-6 max-w-2xl"
      >
        {/* Store Information */}
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-lg p-6`}
        >
          <h3 className="text-lg font-semibold mb-4">Store Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Store Name</label>
              <input
                type="text"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-50 text-gray-800 border-gray-200"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Store Email</label>
              <input
                type="email"
                name="storeEmail"
                value={settings.storeEmail}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-50 text-gray-800 border-gray-200"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">About Us</label>
              <textarea
                name="aboutUs"
                value={settings.aboutUs}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-50 text-gray-800 border-gray-200"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                rows={4}
                placeholder="Write something about your store..."
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-lg p-6`}
        >
          <h3 className="text-lg font-semibold mb-4">Social Media</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Facebook</label>
              <input
                type="url"
                name="socialMedia.facebook"
                value={settings.socialMedia.facebook}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-50 text-gray-800 border-gray-200"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="https://facebook.com/your-page"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Twitter</label>
              <input
                type="url"
                name="socialMedia.twitter"
                value={settings.socialMedia.twitter}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-50 text-gray-800 border-gray-200"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="https://twitter.com/your-handle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instagram</label>
              <input
                type="url"
                name="socialMedia.instagram"
                value={settings.socialMedia.instagram}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-50 text-gray-800 border-gray-200"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="https://instagram.com/your-handle"
              />
            </div>
          </div>
        </div>

        {/* Logo URL */}
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-lg p-6`}
        >
          <h3 className="text-lg font-semibold mb-4">Logo</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Logo URL</label>
              <input
                type="url"
                name="logo"
                value={settings.logo}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-50 text-gray-800 border-gray-200"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Save Settings
        </button>
      </motion.form>
    </div>
  );
}