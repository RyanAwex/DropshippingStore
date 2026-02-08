import React, { useState } from "react";
import {
  X,
  Package,
  Clock,
  CreditCard,
  User,
  Mail,
  Phone,
  Globe,
  Home,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";
import { useOrderStore } from "../../stores/orderStore";

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  const { updateOrderStatus } = useOrderStore();
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "processing":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-50 text-red-600 border-red-200";
      case "refunded":
        return "bg-purple-50 text-purple-600 border-purple-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const handleOrderStatus = async () => {
    if (isUpdating || currentStatus === "delivered") return;

    let newStatus = "";
    if (currentStatus === "pending") {
      newStatus = "processing";
    } else if (currentStatus === "processing") {
      newStatus = "shipped";
    } else if (currentStatus === "shipped") {
      newStatus = "delivered";
    }

    if (newStatus) {
      setIsUpdating(true);
      const result = await updateOrderStatus(order.id, newStatus);
      if (result.success) {
        setCurrentStatus(newStatus);
      }
      setIsUpdating(false);
    }
  };

  const handleCancelRefund = async () => {
    if (isUpdating) return;

    const newStatus = currentStatus === "delivered" ? "refunded" : "cancelled";

    setIsUpdating(true);
    const result = await updateOrderStatus(order.id, newStatus);
    if (result.success) {
      setCurrentStatus(newStatus);
    }
    setIsUpdating(false);
  };

  const getPaymentIcon = (provider) => {
    switch (provider?.toLowerCase()) {
      case "stripe":
        return "💳";
      case "paypal":
        return "🅿️";
      case "google_pay":
        return "🔵";
      case "apple_pay":
        return "🍎";
      default:
        return "💰";
    }
  };

  return (
    <>
      <div
        className="fixed min-h-screen inset-0 bg-black/50 z-[80] backdrop-blur-sm animation-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animation-scale-in border border-gray-100 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-black text-white">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-widest">
                Order Details
              </h3>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                #{String(order.id).slice(0, 8)}...
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {/* Status & Date Row */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-3">
                <button
                  onClick={handleOrderStatus}
                  disabled={
                    isUpdating ||
                    currentStatus === "delivered" ||
                    currentStatus === "cancelled" ||
                    currentStatus === "refunded"
                  }
                  className={`text-[10px] font-bold px-4 py-2 uppercase tracking-widest border transition-all ${getStatusColor(currentStatus)} ${currentStatus === "delivered" || currentStatus === "cancelled" || currentStatus === "refunded" ? "cursor-not-allowed opacity-75" : "cursor-pointer hover:opacity-80"} ${isUpdating ? "opacity-50" : ""}`}
                >
                  {isUpdating ? "Updating..." : currentStatus}
                </button>
                {currentStatus !== "cancelled" &&
                  currentStatus !== "refunded" && (
                    <button
                      onClick={handleCancelRefund}
                      disabled={isUpdating}
                      className="text-[10px] font-bold px-4 py-2 uppercase tracking-widest border border-red-200 bg-red-50 text-red-600 transition-all hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currentStatus === "delivered" ? "Refund" : "Cancel"}
                    </button>
                  )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-4 h-4" />
                <span>
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 border border-gray-200 p-5 space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <User className="w-4 h-4" /> Customer Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-[10px] font-bold">
                    {order.shipping_info?.fullName?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase">
                      {order.shipping_info?.fullName || "N/A"}
                    </p>
                    <p className="text-[10px] text-gray-400">Customer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">
                    {order.shipping_info?.email || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{order.shipping_info?.phone || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 border border-gray-200 p-5 space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Shipping Address
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase">Country</p>
                    <p className="text-gray-500">
                      {order.shipping_info?.country || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Home className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase">City</p>
                    <p className="text-gray-500">
                      {order.shipping_info?.city || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:col-span-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase">Address</p>
                    <p className="text-gray-500">
                      {order.shipping_info?.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-gray-50 border border-gray-200 p-5 space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Payment Information
              </h4>
              <div className="flex flex-wrap gap-6 text-xs">
                <div>
                  <p className="font-bold uppercase mb-1">Provider</p>
                  <span className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-2">
                    <span>{getPaymentIcon(order.payment_provider)}</span>
                    <span className="uppercase font-medium">
                      {order.payment_provider?.replace("_", " ") || "N/A"}
                    </span>
                  </span>
                </div>
                <div>
                  <p className="font-bold uppercase mb-1">Payment ID</p>
                  <span className="font-mono text-gray-500 bg-white border border-gray-200 px-3 py-2 inline-block">
                    {order.payment_id || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Package className="w-4 h-4" /> Order Items (
                {order.items?.length || 0})
              </h4>
              <div className="space-y-3">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="w-16 h-16 bg-white border border-gray-200 flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs font-bold uppercase tracking-wide mb-1">
                        {item.title}
                      </p>
                      {item.selectedOptions && (
                        <p className="text-[10px] text-gray-500 uppercase">
                          {Object.entries(item.selectedOptions)
                            .map(([key, val]) => `${key}: ${val}`)
                            .join(" | ")}
                        </p>
                      )}
                      <p className="text-[10px] text-gray-400 mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      ${Number(item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Total Amount
              </span>
              <span className="text-2xl font-light">
                ${Number(order.total_price).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailModal;
