import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Lock,
  CreditCard,
  ChevronDown,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { coupons } from "../utils/coupons"; // Ensure this path matches your project structure
import {useCartStore} from "../stores/cartStore";

// --- Custom Brand Icons (Inline SVGs) ---
const GooglePayIcon = ({ className }) => (
  <svg viewBox="0 0 40 16" fill="currentColor" className={className}>
    <path d="M6.3 6.6c0-.4 0-.8-.1-1.2H0v2.4h3.6c-.2 1-.8 1.9-1.7 2.5v2.1h2.7c1.6-1.5 2.5-3.7 2.5-6.2z" />
    <path d="M16.5 6.8c0-.5-.1-1-.2-1.4h-3.8v6h1.6v-4.6h2.2c1.2 0 2.1.9 2.1 2.2v2.4h1.6v-2.5c0-1.2-.9-2.1-3.5-2.1z" />
    <path d="M22.2 2.7h-1.6v10.1h1.6V2.7z" />
    <path d="M28.7 2.7l-4.7 10.1h1.7l1-2h6l.9 2H35l-4.5-10.1h-1.8zm-1.3 6.9l2.1-4.6 2.1 4.6h-4.2z" />
    <path d="M37.5 5.3h-1.6v2c0 1.2.9 2.1 2.2 2.1 1.2 0 2.1-.9 2.1-2.1v-2h-1.6v2.1c0 .4-.3.6-.6.6-.4 0-.6-.3-.6-.6V5.3z" />
  </svg>
);

const ApplePayIcon = ({ className }) => (
  <svg viewBox="0 0 38 16" fill="currentColor" className={className}>
    <path d="M5.8 6.5c-1.3 0-2.3 1.1-2.3 2.5s1 2.6 2.3 2.6c1.3 0 2.3-1.1 2.3-2.5.1-1.5-1-2.6-2.3-2.6m0 4c-.7 0-1.1-.6-1.1-1.4S5.1 7.7 5.8 7.7c.7 0 1.1.6 1.1 1.4s-.4 1.4-1.1 1.4m11.8-4c-1.3 0-2.3 1.1-2.3 2.5s1 2.6 2.3 2.6c1.3 0 2.3-1.1 2.3-2.5.1-1.5-1-2.6-2.3-2.6m0 4c-.7 0-1.1-.6-1.1-1.4S17 7.7 17.6 7.7c.7 0 1.1.6 1.1 1.4s-.3 1.4-1.1 1.4M9.5 6.6H8.3v5h1.2V9.3h.8c1.3 0 2.1-.8 2.1-2s-.8-2-2.1-2H9.5v1.3zm.8 1.8h-.8V7.7h.8c.6 0 1 .3 1 .9s-.4.8-1 .8m15.5-2h-1.5l-2.2 5h1.3l.4-1h2.5l.4 1h1.3l-2.2-5zm-1.6 3l.8-2.1.8 2.1h-1.6zm-16.7-6C7.2 3.6 6.9 4 6.9 4.5c0 .6.4 1 1 1 .5 0 1-.5 1-1 0-.5-.4-1.1-1.4-1.1" />
  </svg>
);

const PayPalIcon = ({ className }) => (
  <svg viewBox="0 0 40 16" fill="currentColor" className={className}>
    <path d="M4.3 1.8h4.5c2.4 0 3.3 1.2 3.3 3 0 1.6-1 2.8-3.1 2.8H6.1L5.3 11H3l1.3-9.2zm2.1 4.5h1c.9 0 1.3-.4 1.3-1.3 0-.7-.4-1.1-1.2-1.1H6l.4 2.4z" />
    <path d="M13.9 4.3h1.7l-1.1 6.8h-1.6l1-6.8z" />
    <path d="M19.9 4.3l-2.2 6.8h-1.7l.8-2.6-1.5-4.2h1.8l.6 2.2 2-2.2h.2z" />
    <path d="M23.1 1.8h4.5c2.4 0 3.3 1.2 3.3 3 0 1.6-1 2.8-3.1 2.8h-1.9l-.8 3.5h-2.3l1.3-9.3zm2.1 4.5h1c.9 0 1.3-.4 1.3-1.3 0-.7-.4-1.1-1.2-1.1h-1.5l.4 2.4z" />
    <path d="M33.6 11l-.2-1c-.5.7-1.4 1.2-2.3 1.2-1.4 0-2.2-1.1-2.2-2.6 0-2.2 1.6-4.5 4-4.5.8 0 1.4.2 1.7.6l.2-1.5h1.6l-1.5 7.8h-1.3zm.2-4.1c-.2-.3-.6-.5-1-.5-1.4 0-2.3 1.5-2.3 2.9 0 .8.4 1.3 1.1 1.3.4 0 .9-.3 1.2-.6l1-3.1z" />
    <path d="M38.7 11.1h-1.6V.8h1.6v10.3z" />
  </svg>
);

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

// --- Main Checkout Component ---
const Checkout = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("credit-card");

  // --- Coupon Logic States ---
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const {cartItems, getCartTotal} = useCartStore();

  const subtotal = getCartTotal();
  
  const discountAmount = appliedCoupon
  ? (subtotal * appliedCoupon.discountValue) / 100
  : 0;

  const totalBeforeShipping = subtotal - discountAmount;

  const shipping = totalBeforeShipping > 0 ? totalBeforeShipping > 100 ? 0 : 15 : 0;

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
              <div className="flex flex-col">
                <label className="text-xs uppercase font-bold text-gray-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
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
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col md:col-span-2">
                <label className="text-xs uppercase font-bold text-gray-400 mb-2">
                  Country/Region
                </label>
                <div className="relative w-full">
                  <select className="w-full appearance-none border border-gray-200 px-4 py-3 pr-10 text-sm bg-white focus:outline-none focus:border-black transition-colors cursor-pointer rounded-none">
                    <option>United States</option>
                    <option>Morocco</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-xs uppercase font-bold text-gray-400 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs uppercase font-bold text-gray-400 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-none"
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
                icon={PayPalIcon}
                isSelected={selectedPaymentMethod === "paypal"}
                onSelect={setSelectedPaymentMethod}
              />
              <PaymentButton
                id="google-pay"
                label="G Pay"
                icon={GooglePayIcon}
                isSelected={selectedPaymentMethod === "google-pay"}
                onSelect={setSelectedPaymentMethod}
              />
              <PaymentButton
                id="apple-pay"
                label="Apple Pay"
                icon={ApplePayIcon}
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
                      <img src="/payments/Mastercard.svg" alt="Mastercard Card" />
                    </div>
                    <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
                      <img src="/payments/Visa.svg" alt="Visa Card" />
                    </div>
                    <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
                      <img src="/payments/American_Express.svg" alt="American Express Card" />
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
                      {Object.entries(item.selectedOptions).map(([value]) => `${value}`).join(' | ')}
                    </p>
                  </div>
                  <div className="text-sm font-medium">${item.price.toFixed(2)}</div>
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
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
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

            <button className="w-full group relative px-8 py-4 border border-black overflow-hidden bg-black text-white">
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
