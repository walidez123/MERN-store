import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Dashboard from "./pages/dashboard/Dashboard";
import Checkout from "./pages/Checkout";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyAccount from "./pages/VerifyAccount";
import ResetPassword from "./pages/ResetPassword";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Footer from "./components/Footer";
import UserOrders from "./pages/orders";
import FavoritesPage from "./pages/Favourits";
import ProductDetails from "./pages/Product";

const stripePromise = loadStripe(
  "pk_test_51Q3rYoJkQt0uImZSyTyKMgkDAz7yESvguPhLndNzyeENZvSzfMmlZ9Z1k3XzJ0KK5uAd09NlFNmagY9r81geqodk00Ix4fb7CH"
);

function AppContent() {
  const location = useLocation();

  // Routes where the Footer should not appear
  const noFooterRoutes = ["/dashboard"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-r from-slate-900 to-slate-700 transition-colors duration-200">
      <Navbar />
      <Toaster />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />
          <Route path="/acount/orders" element={<UserOrders />} />
          <Route path="/acount/favourits" element={<FavoritesPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        {/* Render Footer only if the current route is not in noFooterRoutes */}
        {!noFooterRoutes.includes(location.pathname) && <Footer />}
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <Router>
          <AppContent />
        </Router>
      </Elements>
    </Provider>
  );
}

export default App;
