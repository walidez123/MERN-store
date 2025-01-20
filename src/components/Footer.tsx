import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { RootState } from '../store/store';
import { fetchSettings } from '../store/slices/settingsSlice';
import ContactForm from './ContactForm';

export default function Footer() {
  const dispatch = useDispatch();
  const { settings, loading } = useSelector((state: RootState) => state.settings);
  const { darkMode } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    if (!settings) {
      dispatch(fetchSettings());
    }
  }, [dispatch, settings]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }
  return (
    <footer className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} mt-20 `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {settings?.aboutUs || "We're dedicated to providing the best shopping experience."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Shop', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Mail size={18} />
                {settings?.contactEmail || "contact@example.com"}
              </li>
              </ul>

            <div className="flex gap-4 mt-4">
              {[
                { icon: Facebook, href: settings?.socialLinks?.facebook },
                { icon: Twitter, href: settings?.socialLinks?.twitter },
                { icon: Instagram, href: settings?.socialLinks?.instagram },
              ]
                .filter(({ href }) => href)
                .map(({ icon: Icon, href }) => (
                  <a
                    key={href}
                    href={href}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={20} />
                  </a>
                ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 lg:col-span-1">
            <ContactForm />
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} {settings?.siteTitle || 'Your Store'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
