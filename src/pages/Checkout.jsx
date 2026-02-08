import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Lock,
  CreditCard,
  ChevronDown,
  Calendar,
  MoreHorizontal,
  CheckCircle,
  Package,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { coupons } from "../utils/coupons"; // Ensure this path matches your project structure
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
import { Paypal, GPay, ApplePay } from "../utils/svg";
import supabase from "../utils/supabase";

// --- Custom Expiration Picker ---
const ExpirationDatePicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const containerRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0"),
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (type, value) => {
    if (type === "month") setSelectedMonth(value);
    if (type === "year") setSelectedYear(value);
  };

  return (
    <div className="relative w-full bg-white" ref={containerRef}>
      <style>{` .no-scrollbar::-webkit-scrollbar { display: none; } `}</style>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border px-4 py-3 text-sm flex justify-between items-center cursor-pointer transition-colors
          ${isOpen ? "border-black" : "border-gray-200 hover:border-gray-400"}
          ${!selectedMonth && !selectedYear ? "text-gray-400" : "text-black"}
        `}
      >
        <span className="font-medium">
          {selectedMonth && selectedYear
            ? `${selectedMonth} / ${selectedYear}`
            : "MM / YY"}
        </span>
        <Calendar className="w-4 h-4 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border border-black z-50 mt-[-1px] shadow-xl flex h-56">
          <div className="w-1/2 overflow-y-auto border-r border-gray-100 no-scrollbar">
            <div className="p-2 text-xs font-bold uppercase tracking-widest text-gray-400 sticky top-0 bg-white border-b border-gray-50">
              Month
            </div>
            {months.map((month) => (
              <div
                key={month}
                onClick={() => handleSelect("month", month)}
                className={`px-4 py-3 text-sm cursor-pointer transition-colors ${selectedMonth === month ? "bg-black text-white" : "hover:bg-gray-50"}`}
              >
                {month}
              </div>
            ))}
          </div>
          <div className="w-1/2 overflow-y-auto no-scrollbar">
            <div className="p-2 text-xs font-bold uppercase tracking-widest text-gray-400 sticky top-0 bg-white border-b border-gray-50">
              Year
            </div>
            {years.map((year) => (
              <div
                key={year}
                onClick={() => handleSelect("year", year)}
                className={`px-4 py-3 text-sm cursor-pointer transition-colors ${selectedYear === year ? "bg-black text-white" : "hover:bg-gray-50"}`}
              >
                {year}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Payment Button ---
const PaymentButton = ({ id, label, icon: Icon, isSelected, onSelect }) => (
  <button
    onClick={() => onSelect(id)}
    className={`flex flex-col items-center justify-center gap-3 border p-4 text-sm transition-all duration-200 h-24
      ${isSelected ? "bg-black text-white border-black" : "bg-white text-black border-gray-200 hover:border-black hover:bg-gray-50"}`}
  >
    {Icon && (
      <Icon
        className={`h-6 w-auto ${isSelected ? "text-white" : "text-black"}`}
      />
    )}
    <span className="font-medium uppercase tracking-wider text-[10px]">
      {label}
    </span>
  </button>
);

const OrderSuccess = ({ order, countdown }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col h-screen overflow-hidden animation-fade-in">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md w-full mx-auto px-6 py-8 flex flex-col items-center justify-center min-h-full">
          {/* Animated checkmark */}
          <div className="mb-5 flex justify-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>

          <h1 className="text-2xl font-light uppercase tracking-widest mb-2 text-center">
            Order Placed
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5 text-center">
            Thank you for your purchase
          </p>

          {/* Order info card */}
          <div className="bg-gray-50 border border-gray-200 p-5 mb-5 text-left space-y-3 w-full">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="p-2 bg-black text-white">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Order ID
                </p>
                <p className="text-xs font-mono text-gray-600">#{order.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
                  Customer
                </p>
                <p className="text-xs font-medium">{order.fullName}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
                  Contact
                </p>
                <p className="text-xs font-medium truncate">
                  {order.shipping_info.email} <br />
                  {order.shipping_info.phone}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
                Address
              </p>
              <p className="text-xs font-medium">
                {order.shipping_info.address}, {order.shipping_info.city},{" "}
                {order.shipping_info.country}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Items
              </p>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wide flex-grow truncate">
                      {item.title}
                    </span>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      ×{item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Total
              </p>
              <p className="text-lg font-medium">${order.total.toFixed(2)}</p>
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-5 leading-relaxed text-center">
            Your order has been successfully submitted. Our team will start
            preparing it right away.
          </p>

          {/* Countdown */}
          <div className="text-center w-full">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Redirecting to your profile in
            </p>
            <div className="inline-flex items-center justify-center w-9 h-9 border border-black text-sm font-bold mb-3">
              {countdown}
            </div>
            <div className="w-full bg-gray-200 h-[2px] overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-1000 ease-linear"
                style={{ width: `${((7 - countdown) / 7) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Checkout Component ---
const Checkout = () => {
  const navigate = useNavigate();

  // --- Stores ---
  const { isAuthenticated, user } = useAuthStore();
  const { cartItems, getCartTotal, clearCart } = useCartStore();

  // user info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const fullName = `${firstName} ${lastName}`;

  // --- Order Success State ---
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [countdown, setCountdown] = useState(7);

  // --- Payment Method State ---
  const [cardNumber, setCardNumber] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("credit-card");

  // --- Coupon Logic States ---
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // --- Calculated Totals ---
  const subtotal = getCartTotal();
  const discountAmount = appliedCoupon
    ? (subtotal * appliedCoupon.discountValue) / 100
    : 0;
  const totalBeforeShipping = subtotal - discountAmount;
  const shipping =
    totalBeforeShipping > 0 ? (totalBeforeShipping > 100 ? 0 : 15) : 0;
  const total = totalBeforeShipping + shipping;

  const handleApplyCoupon = () => {
    // Reset messages
    setCouponError("");
    setCouponSuccess("");
    setAppliedCoupon(null);

    const codeToApply = couponInput.trim().toUpperCase();

    if (!codeToApply) return;

    // 1. Find Coupon
    const coupon = coupons.find((c) => c.code === codeToApply);

    if (!coupon) {
      setCouponError("This coupon doesn't exist");
      return;
    }

    // 2. Check Expiration
    const today = new Date();
    const expirationDate = new Date(coupon.expirationDate);
    if (today > expirationDate) {
      setCouponError("Coupon has expired");
      return;
    }

    // 3. Check Usage Limit
    if (coupon.usageLimit !== null && coupon.timesUsed >= coupon.usageLimit) {
      setCouponError(
        `Coupon was available only for ${coupon.usageLimit} users`,
      );
      return;
    }

    // 4. Success
    setAppliedCoupon(coupon);
    setCouponSuccess(
      `Coupon applied: ${coupon.code} (-${coupon.discountValue}%)`,
    );
  };

  const handleSubmit = async () => {
    try {
      if (!isAuthenticated) {
        navigate("/auth");
        return;
      }

      // Map payment methods to database values
      // Allowed values: 'stripe', 'paypal', 'google_pay', 'apple_pay'
      const paymentProviderMap = {
        "credit-card": "stripe",
        paypal: "paypal",
        "google-pay": "google_pay",
        "apple-pay": "apple_pay",
      };

      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        items: cartItems,
        total_price: total,
        shipping_info: {
          fullName,
          email,
          phone,
          country,
          city,
          address,
        },
        payment_id: Math.random().toString(36).substring(2, 30), // Mock payment ID
        payment_provider:
          paymentProviderMap[selectedPaymentMethod] || selectedPaymentMethod,
      });

      if (error) {
        throw error;
      }

      clearCart();

      // Show success screen with order details
      setOrderSuccess({
        id: Math.random().toString(36).substring(2, 10).toUpperCase(),
        fullName,
        shipping_info: {
          email,
          phone,
          country,
          city,
          address,
        },
        items: cartItems,
        total,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // Countdown + redirect when order is successful
  useEffect(() => {
    if (!orderSuccess) return;
    if (countdown <= 0) {
      navigate("/user/profile");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [orderSuccess, countdown, navigate]);

  // Show full-screen success overlay
  if (orderSuccess) {
    return <OrderSuccess order={orderSuccess} countdown={countdown} />;
  }

  return (
    <div className="bg-white min-h-screen pt-10 pb-10 lg:pb-50 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-12">
        <Link
          to="/user/cart"
          className="flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Return to Cart
        </Link>
        <div className="mx-auto pr-24 hidden md:block">
          <span className="text-2xl font-bold tracking-widest uppercase">
            Vraxia Checkout
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Left Column */}
        <div className="flex-grow space-y-12">
          {/* ... Contact & Shipping Sections (Same as before) ... */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs uppercase font-bold text-gray-400 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-none"
                    placeholder="John"
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs uppercase font-bold text-gray-400 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-none"
                    placeholder="Doe"
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-xs uppercase font-bold text-gray-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="newsletter"
                  className="accent-black w-4 h-4"
                />
                <label htmlFor="newsletter" className="text-sm text-gray-500">
                  Email me with news and offers
                </label>
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="text-xs uppercase font-bold text-gray-400 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-none"
                  placeholder="+1 (123) 456 789"
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs uppercase font-bold text-gray-400 mb-2">
                  Country/Region
                </label>
                <div className="relative w-full">
                  <select
                    className="w-full appearance-none border border-gray-200 px-4 py-3 pr-10 text-sm bg-white focus:outline-none focus:border-black transition-colors cursor-pointer rounded-none"
                    onChange={(e) => {
                      setCountry(e.target.value);
                    }}
                  >
                    <option value="" disabled defaultValue={""}>
                      Select Country
                    </option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="MA">Morocco</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-xs uppercase font-bold text-gray-400 mb-2">
                  City
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-none"
                  placeholder="London"
                  onChange={(e) => {
                    setCity(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="text-xs uppercase font-bold text-gray-400 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-none"
                  placeholder="1234 Main St"
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                />
              </div>
            </div>
          </section>

          {/* Payment Section */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
              Payment Method
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <PaymentButton
                id="credit-card"
                label="Card"
                icon={CreditCard}
                isSelected={selectedPaymentMethod === "credit-card"}
                onSelect={setSelectedPaymentMethod}
              />
              <PaymentButton
                id="paypal"
                label="PayPal"
                icon={Paypal}
                isSelected={selectedPaymentMethod === "paypal"}
                onSelect={setSelectedPaymentMethod}
              />
              <PaymentButton
                id="google-pay"
                label="G Pay"
                icon={GPay}
                isSelected={selectedPaymentMethod === "google-pay"}
                onSelect={setSelectedPaymentMethod}
              />
              <PaymentButton
                id="apple-pay"
                label="Apple Pay"
                icon={ApplePay}
                isSelected={selectedPaymentMethod === "apple-pay"}
                onSelect={setSelectedPaymentMethod}
              />
            </div>

            {selectedPaymentMethod === "credit-card" ? (
              <div className="border border-gray-200 p-6 rounded-sm bg-gray-50/50 animation-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <span className="flex items-center text-sm font-bold uppercase tracking-wide">
                    Card Details
                  </span>
                  <div className="flex space-x-2">
                    <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
                      <img
                        src="/payments/Mastercard.svg"
                        alt="Mastercard Card"
                      />
                    </div>
                    <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
                      <img src="/payments/Visa.svg" alt="Visa Card" />
                    </div>
                    <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
                      <img
                        src="/payments/American_Express.svg"
                        alt="American Express Card"
                      />
                    </div>
                    <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
                      <MoreHorizontal size={14} />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name on Card"
                    className="w-full border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    maxLength={19}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, "");
                      const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
                      setCardNumber(formatted);
                    }}
                    className="w-full border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-black"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <ExpirationDatePicker />
                    <input
                      type="text"
                      placeholder="CVC"
                      maxLength={4}
                      className="w-full border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
                <div className="flex items-center mt-6 text-gray-500 text-xs">
                  <Lock className="w-3 h-3 mr-1" /> Payments are secure and
                  encrypted.
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 p-8 rounded-sm bg-gray-50/30 text-center flex flex-col items-center justify-center min-h-[250px]">
                <p className="text-xs text-gray-500 mb-6">
                  You will be redirected to a secure checkout page.
                </p>
                <button className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                  Proceed to Payment
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="bg-gray-50 p-8 sticky top-10">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-8 border-b border-gray-200 pb-8">
              {cartItems.map((item) => (
                <div key={item.cartId} className="flex gap-4">
                  <div className="w-16 h-16 bg-white border border-gray-200 relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold uppercase tracking-wide">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {Object.entries(item.selectedOptions)
                        .map(([value]) => `${value}`)
                        .join(" | ")}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* --- COUPON SECTION --- */}
            <div className="mb-8 border-b border-gray-200 pb-8">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Gift card or discount code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-grow border border-gray-200 p-3 text-sm focus:outline-none focus:border-black"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 bg-gray-200 text-gray-500 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                >
                  Apply
                </button>
              </div>

              {/* Feedback Messages */}
              {couponSuccess && (
                <p className="text-xs text-green-600 font-medium mt-2">
                  {couponSuccess}
                </p>
              )}
              {couponError && (
                <p className="text-xs text-red-500 font-medium mt-2">
                  {couponError}
                </p>
              )}
            </div>

            {/* --- TOTALS --- */}
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              {/* Discount Row (Only visible if coupon applied) */}
              {appliedCoupon && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between text-lg font-medium mb-8 border-t border-gray-200 pt-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full group relative px-8 py-4 border border-black overflow-hidden bg-black text-white"
            >
              <span className="absolute inset-0 w-full h-full bg-white translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"></span>
              <span className="relative z-10 w-full flex justify-center items-center text-xs font-bold uppercase tracking-widest group-hover:text-black transition-colors duration-300">
                Place Order
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
