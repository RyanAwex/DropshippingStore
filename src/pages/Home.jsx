import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, Search, Menu, User, X, ChevronDown } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useProductStore } from "../stores/productStore";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import BenefitsStrip from "../components/BenefitsStrip";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";

const Home = () => {
  // --- States ---
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // New State for Mobile Menu
  const { logout, isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const {
    products,
    fetchProducts,
    isLoading: productsLoading,
  } = useProductStore();
  const profileRef = useRef(null);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const { getCartItemCount } = useCartStore();

  // Check auth and fetch products on mount
  useEffect(() => {
    checkAuth();
    fetchProducts();
  }, [checkAuth, fetchProducts]);

  // Close profile popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount to ensure scroll is re-enabled
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <div>
      {/* --- MOBILE MENU OVERLAY --- */}
      <div
        className={`fixed inset-0 bg-white z-[60] flex flex-col transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center px-6 py-6 border-b border-gray-100">
          <span className="text-2xl font-bold tracking-widest uppercase">
            Menu
          </span>
          <button onClick={() => setIsMenuOpen(false)}>
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        <div className="flex flex-col p-8 space-y-6 overflow-y-auto h-full">
          {/* Main Links */}
          <nav className="flex flex-col space-y-6 text-lg font-light uppercase tracking-widest">
            <NavLink
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`hover:text-black transition-colors ${location.pathname === "/" ? "text-black font-semibold" : ""}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-gray-500"
            >
              Shop
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-gray-500"
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-gray-500"
            >
              Contact
            </NavLink>
          </nav>

          {/* Account Section (Moved here for mobile) */}
          <div className="mt-auto border-t border-gray-100 pt-8">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
              Account
            </p>
            <div className="grid grid-cols-2 gap-4">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="w-full py-3 border border-black text-black text-xs font-bold uppercase tracking-widest text-center hover:bg-gray-50 transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    to="/user/profile"
                    className="w-full py-3 border border-black text-black text-xs font-bold uppercase tracking-widest text-center hover:bg-gray-50 transition-colors"
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-4 bg-black text-white text-xs font-bold uppercase tracking-widest text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-4 border border-black text-black text-xs font-bold uppercase tracking-widest text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION BAR --- */}
      <nav className="flex justify-between items-center px-6 md:px-10 py-6 border-b border-gray-100 sticky top-0 bg-white/95 z-50 backdrop-blur-sm">
        <div className="text-2xl font-bold tracking-widest uppercase">
          Vraxia
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 text-xs font-bold uppercase tracking-widest text-gray-500">
          <NavLink
            to="/"
            className={`hover:text-black transition-colors ${location.pathname === "/" ? "text-black" : ""}`}
          >
            Home
          </NavLink>
          <NavLink to="/shop" className="hover:text-black transition-colors">
            Shop
          </NavLink>
          <NavLink to="/about" className="hover:text-black transition-colors">
            About
          </NavLink>
          <NavLink to="/contact" className="hover:text-black transition-colors">
            Contact
          </NavLink>
        </div>

        <div className="flex items-center space-x-6">
          <Search className="w-5 h-5 cursor-pointer hover:text-black transition-colors" />

          <div className="relative flex items-center justify-center">
            <Link to="/user/cart">
              <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-black transition-colors" />
            </Link>
            {getCartItemCount() > 0 && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-black rounded-full flex items-center justify-center text-white text-[12px] font-semibold">
                {getCartItemCount()}
              </div>
            )}
          </div>

          <div className="hidden md:block relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center focus:outline-none"
            >
              <User
                className={`w-5 h-5 cursor-pointer transition-colors ${isProfileOpen ? "text-black" : "hover:text-black"}`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-6 w-48 bg-white border border-gray-100 shadow-xl p-5 z-50 animation-fade-in">
                <div className="absolute -top-2 right-1 w-4 h-4 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                <div className="relative z-10 flex flex-col gap-3">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 text-center">
                    Account
                  </p>
                  {isAuthenticated ? (
                    <>
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="w-full py-3 border border-black text-black text-xs font-bold uppercase tracking-widest text-center hover:bg-gray-50 transition-colors"
                        >
                          Dashboard
                        </Link>
                      )}
                      <Link
                        to="/user/profile"
                        className="w-full py-3 border border-black text-black text-xs font-bold uppercase tracking-widest text-center hover:bg-gray-50 transition-colors"
                      >
                        Profile
                      </Link>
                      {/* {!isLoading ? (
                        <button
                          onClick={() => logout()}
                          className="w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-widest text-center hover:bg-gray-800 transition-colors"
                        >
                          Logout
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-3 bg-gray-300 text-white text-xs font-bold uppercase tracking-widest text-center cursor-not-allowed"
                        >
                          Logging Out...
                        </button>
                      )} */}
                    </>
                  ) : (
                    <>
                      <Link
                        to="/auth"
                        className="w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-widest text-center hover:bg-gray-800 transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        to="/auth"
                        className="w-full py-3 border border-black text-black text-xs font-bold uppercase tracking-widest text-center hover:bg-gray-50 transition-colors"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden focus:outline-none"
          >
            <Menu className="w-5 h-5 cursor-pointer" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-[60vh] min-h-[calc(100vh-80.79px)] sm:min-h-[600px] flex items-center justify-center bg-gray-100 text-center">
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)",
          }}
        >
          <img
            src="banner.jpg"
            alt="Hero"
            className="w-full h-full object-cover opacity-90"
          />
        </div>
        <div className="relative z-10 max-w-2xl px-6">
          <h1 className="text-4xl font-bold md:text-6xl sm:font-light mb-8 text-white drop-shadow-lg tracking-tight uppercase">
            Essentials for
            <br />
            Modern Living
          </h1>
          <Link
            to="/shop"
            className="group relative cursor-pointer px-12 py-3 overflow-hidden bg-white inline-block shadow-2xl"
          >
            <span className="absolute inset-0 w-full h-full bg-black translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"></span>
            <span className="relative z-10 text-xs font-bold uppercase tracking-widest text-black group-hover:text-white transition-colors duration-300 text-center">
              View All Products
            </span>
          </Link>
          <div className="flex justify-center items-end">
            <ChevronDown className="w-6 h-6 text-white mt-8 mx-auto animate-bounce" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-20 w-full">
        <BenefitsStrip />

        {/* Loading State */}
        {productsLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xs uppercase tracking-widest text-gray-400">
                Loading products...
              </p>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {!productsLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 justify-items-center">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="flex justify-center mt-20">
          <Link
            to="/shop"
            className="group relative cursor-pointer px-12 py-3 border border-black overflow-hidden bg-white inline-block"
          >
            <span className="absolute inset-0 w-full h-full bg-black translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"></span>
            <span className="relative z-10 text-xs font-bold uppercase tracking-widest text-black group-hover:text-white transition-colors duration-300 text-center">
              View All Products
            </span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
