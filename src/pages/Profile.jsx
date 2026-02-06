import React, { useEffect, useState } from "react";
import {
  User,
  Package,
  Star,
  LogOut,
  ChevronRight,
  MapPin,
  CreditCard,
  Clock,
  Image as ImageIcon,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useOrderStore } from "../stores/orderStore";
import { OrderDetailModal } from "../components/dashboard";
import { Link, useNavigate } from "react-router-dom";

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "bg-green-50 text-green-700 border-green-200";
    case "shipped":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "processing":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "cancelled":
      return "bg-red-50 text-red-600 border-red-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user, logout } = useAuthStore();
  const { fetchOrders, isLoading: ordersLoading } = useOrderStore();
  const navigate = useNavigate();

  const orders = useOrderStore((state) => state.orders);

  const userName =
    user.user_metadata.full_name || user.user_metadata.first_name;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="bg-white min-h-screen pt-10 pb-20 px-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-12 border-b border-gray-100 pb-6">
        <Link
          to="/"
          className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-light uppercase tracking-widest mb-2">
          My Account
        </h1>
        <p className="text-gray-400 text-xs uppercase tracking-wider">
          Welcome back, {userName}!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* --- LEFT SIDEBAR: USER INFO & NAV --- */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-10">
          {/* User Profile "Image" */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center border border-gray-200">
              <User className="w-8 h-8 text-black" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest">
                {userName}
              </h2>
              <p className="text-xs text-gray-500 mt-1">{user.email}</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">
                Joined: {user.created_at.slice(0, 10)}
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between p-4 border-l-2 text-xs font-bold uppercase tracking-widest transition-all
                ${activeTab === "orders" ? "border-black bg-gray-50 text-black" : "border-transparent text-gray-400 hover:text-black hover:bg-gray-50"}
              `}
            >
              <span className="flex items-center">
                <Package className="w-4 h-4 mr-3" /> Orders
              </span>
              <ChevronRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`w-full flex items-center justify-between p-4 border-l-2 text-xs font-bold uppercase tracking-widest transition-all
                ${activeTab === "reviews" ? "border-black bg-gray-50 text-black" : "border-transparent text-gray-400 hover:text-black hover:bg-gray-50"}
              `}
            >
              <span className="flex items-center">
                <Star className="w-4 h-4 mr-3" /> Reviews
              </span>
              <ChevronRight className="w-3 h-3" />
            </button>

            {/* Visual placeholders for other common settings */}
            <button
              disabled
              className="w-full flex items-center justify-between p-4 border-l-2 border-transparent text-xs font-bold uppercase tracking-widest text-gray-300 cursor-not-allowed"
            >
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-3" /> Addresses
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 border-l-2 border-transparent text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors mt-8"
            >
              <span className="flex items-center">
                <LogOut className="w-4 h-4 mr-3" /> Sign Out
              </span>
            </button>
          </nav>
        </aside>

        {/* --- RIGHT CONTENT AREA --- */}
        <main className="flex-grow">
          {/* TAB: ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-6 animation-fade-in">
              <h3 className="text-xl font-light uppercase tracking-widest mb-8">
                Order History
              </h3>

              {/* Loading State */}
              {ordersLoading && (
                <div className="border border-gray-200 p-12 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xs uppercase tracking-widest text-gray-400">
                      Loading orders...
                    </p>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!ordersLoading && orders.length === 0 && (
                <div className="border border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center bg-gray-50">
                  <ShoppingBag className="w-12 h-12 text-gray-200 mb-4" />
                  <h4 className="text-sm font-bold uppercase tracking-widest mb-2">
                    No Orders Yet
                  </h4>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Your order history will appear here
                  </p>
                </div>
              )}

              {/* Orders List */}
              {!ordersLoading && orders.length > 0 && (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 p-6 hover:border-black transition-colors group"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-mono text-gray-400">
                              #{String(order.id).slice(0, 8)}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-3 py-1 uppercase tracking-wider border ${getStatusStyle(order.status)}`}
                            >
                              {order.status || "Pending"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(order.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        </div>
                        <span className="text-lg font-light">
                          ${Number(order.total_price).toFixed(2)}
                        </span>
                      </div>

                      <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-2">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <ImageIcon className="w-3 h-3" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-xs font-medium uppercase tracking-wide">
                                  {item.title}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                  Qty: {item.quantity} · $
                                  {Number(item.price).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-6 py-2 border border-gray-200 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Order Detail Modal */}
              {selectedOrder && (
                <OrderDetailModal
                  order={selectedOrder}
                  onClose={() => setSelectedOrder(null)}
                />
              )}
            </div>
          )}

          {/* TAB: REVIEWS (Coming Soon) */}
          {activeTab === "reviews" && (
            <div className="h-full flex flex-col items-center justify-center text-center border border-dashed border-gray-200 p-12 lg:min-h-[400px] animation-fade-in bg-gray-50">
              <div className="w-16 h-16 bg-white border border-gray-200 flex items-center justify-center mb-6 rounded-full">
                <Star className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-2">
                My Reviews
              </h3>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-8">
                This feature is currently under development.
              </p>
              <div className="inline-block border border-black px-4 py-1 text-[10px] font-bold uppercase tracking-widest bg-black text-white">
                Coming Soon
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
