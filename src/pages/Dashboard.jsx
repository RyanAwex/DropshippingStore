import React, { useState, useEffect } from "react";
import {
  Package,
  ShoppingBag,
  Plus,
  Pencil,
  Trash2,
  MoreVertical,
  DollarSign,
  Box,
  Image as ImageIcon,
  RefreshCw,
  Clock,
  Eye,
} from "lucide-react";
import { useProductStore } from "../stores/productStore";
import { useOrderStore } from "../stores/orderStore";
import {
  Toast,
  StatCard,
  Sidebar,
  ProductDrawer,
  OrderDetailModal,
} from "../components/dashboard";

// --- MAIN DASHBOARD ---
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Product store
  const {
    products,
    isLoading: productsLoading,
    fetchProducts,
    refreshProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();

  // Order store
  const {
    orders,
    isLoading: ordersLoading,
    fetchOrders,
    getOrderStats,
  } = useOrderStore();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch orders when orders tab is active
  useEffect(() => {
    if (activeTab === "orders" || activeTab === "overview") {
      fetchOrders();
    }
  }, [activeTab, fetchOrders]);

  const handleSave = async (data) => {
    if (editingProduct) {
      const result = await updateProduct(editingProduct.id, data);
      if (result.success) {
        setToast({ message: "Product Updated", type: "success" });
      } else {
        setToast({ message: "Failed to update product", type: "error" });
      }
    } else {
      const result = await addProduct(data);
      if (result.success) {
        setToast({ message: "Product Created", type: "success" });
      } else {
        setToast({ message: "Failed to create product", type: "error" });
      }
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      const result = await deleteProduct(id);
      if (result.success) {
        setToast({ message: "Product Deleted", type: "success" });
      } else {
        setToast({ message: "Failed to delete product", type: "error" });
      }
    }
  };

  // Get order stats for overview
  const orderStats = getOrderStats();

  // Helper to safely format category data that may be double-stringified
  const formatCategories = (category) => {
    if (!category) return "";
    const cats = Array.isArray(category) ? category : [category];
    return cats
      .flatMap((c) => {
        if (typeof c === "string") {
          try {
            const parsed = JSON.parse(c);
            return Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            return [c];
          }
        }
        return [c];
      })
      .join(", ");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <main className="flex-1 lg:ml-64 p-6 lg:p-12 transition-all duration-300">
        <div className="lg:hidden mb-8 flex justify-between items-center">
          <span className="text-xl font-bold uppercase tracking-widest">
            Vraxia Admin
          </span>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 bg-white rounded border border-gray-300 shadow-lg hover:opacity-60 cursor-pointer transition-all duration-200 "
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-end border-b border-gray-200 pb-6">
              <h1 className="text-4xl font-light uppercase tracking-widest">
                Dashboard
              </h1>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 hidden sm:block">
                Last updated: Just now
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                label="Total Revenue"
                value={`$${orderStats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={DollarSign}
              />
              <StatCard
                label="Total Orders"
                value={orderStats.totalOrders}
                icon={ShoppingBag}
              />
              <StatCard
                label="Total Products"
                value={products.length}
                icon={Box}
              />
              <StatCard
                label="Pending Orders"
                value={orderStats.pendingOrders}
                icon={Clock}
              />
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-gray-200 pb-6">
              <div>
                <h1 className="text-4xl font-light uppercase tracking-widest mb-2">
                  Products
                </h1>
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  {products.length} Total Products
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={refreshProducts}
                  className="group relative px-6 py-3 border border-black overflow-hidden bg-white text-black hover:bg-gray-50 transition-all"
                >
                  <span className="flex items-center text-xs font-bold uppercase tracking-widest">
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${productsLoading ? "animate-spin" : ""}`}
                    />{" "}
                    Refresh
                  </span>
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsDrawerOpen(true);
                  }}
                  className="group relative px-8 py-3 border border-black overflow-hidden bg-black text-white"
                >
                  <span className="absolute inset-0 w-full h-full bg-white translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"></span>
                  <span className="relative z-10 flex items-center text-xs font-bold uppercase tracking-widest group-hover:text-black transition-colors duration-300">
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                  </span>
                </button>
              </div>
            </div>

            {/* Loading State */}
            {productsLoading && (
              <div className="bg-white border border-gray-200 p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-xs uppercase tracking-widest text-gray-400">
                    Loading products...
                  </p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!productsLoading && products.length === 0 && (
              <div className="bg-white border border-gray-200 p-12 flex items-center justify-center">
                <div className="text-center">
                  <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-xs uppercase tracking-widest text-gray-400">
                    No products yet
                  </p>
                </div>
              </div>
            )}

            {/* Product Table / Grid */}
            {!productsLoading && products.length > 0 && (
              <div className="bg-white border border-gray-200 shadow-sm">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-black bg-gray-50">
                        <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Image
                        </th>
                        <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Product Name
                        </th>
                        <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Categories
                        </th>
                        <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Price
                        </th>
                        <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Stock
                        </th>
                        <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                        >
                          <td className="p-5">
                            <div className="w-12 h-12 bg-gray-100 border border-gray-200 overflow-hidden">
                              {product.images && product.images[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <ImageIcon className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-5 text-xs font-bold uppercase tracking-wide">
                            {product.title}
                          </td>
                          <td className="p-5 text-xs text-gray-500 uppercase tracking-wider max-w-[200px] truncate">
                            {formatCategories(product.category)}
                          </td>
                          <td className="p-5 text-xs font-medium">
                            ${Number(product.price).toFixed(2)}
                          </td>
                          <td className="p-5">
                            <span
                              className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider ${product.stock < 5 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}
                            >
                              {product.stock} Units
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  setEditingProduct(product);
                                  setIsDrawerOpen(true);
                                }}
                                className="p-2 border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="p-2 border border-gray-200 hover:border-red-500 hover:bg-red-500 hover:text-white transition-all"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden grid grid-cols-1 gap-0">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 border-b border-gray-100 flex gap-4 items-center"
                    >
                      <div className="w-16 h-20 bg-gray-100 flex-shrink-0">
                        {product.images && product.images[0] && (
                          <img
                            src={product.images[0]}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">
                          {formatCategories(product.category)}
                        </p>
                        <h3 className="text-xs font-bold uppercase mb-2 line-clamp-1">
                          {product.title}
                        </h3>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            ${Number(product.price).toFixed(2)}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setIsDrawerOpen(true);
                              }}
                              className="p-2 border border-gray-200"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 border border-gray-200 text-red-500"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-gray-200 pb-6">
              <div>
                <h1 className="text-4xl font-light uppercase tracking-widest mb-2">
                  Orders
                </h1>
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  {orders.length} Total Orders
                </p>
              </div>
              <button
                onClick={fetchOrders}
                className="group relative px-8 py-3 border border-black overflow-hidden bg-white text-black hover:bg-black hover:text-white transition-all"
              >
                <span className="flex items-center text-xs font-bold uppercase tracking-widest">
                  Refresh Orders
                </span>
              </button>
            </div>

            {/* Loading State */}
            {ordersLoading && (
              <div className="bg-white border border-gray-200 p-12 flex items-center justify-center">
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
              <div className="bg-white border border-gray-200 p-12 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-xs uppercase tracking-widest text-gray-400">
                    No orders yet
                  </p>
                </div>
              </div>
            )}

            {/* Orders Table */}
            {!ordersLoading && orders.length > 0 && (
              <div className="bg-white border border-gray-200 shadow-sm">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-black bg-gray-50">
                        <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Order
                        </th>
                        <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Customer
                        </th>
                        <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Total
                        </th>
                        <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Status
                        </th>
                        <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Payment
                        </th>
                        <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Date
                        </th>
                        <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                        >
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                {order.items?.[0]?.image ? (
                                  <img
                                    src={order.items[0].image}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <ImageIcon className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-[10px] font-mono text-gray-400">
                                  #{String(order.id).slice(0, 8)}
                                </p>
                                <p className="text-xs font-medium">
                                  {order.items?.length || 0} items
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wide">
                                  {order.shipping_info?.fullName || "N/A"}
                                </p>
                                <p className="text-[10px] text-gray-400 truncate max-w-[150px]">
                                  {order.shipping_info?.email || ""}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-5">
                            <span className="text-sm font-medium">
                              ${Number(order.total_price).toFixed(2)}
                            </span>
                          </td>
                          <td className="p-5">
                            <span
                              className={`text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider border ${
                                order.status === "delivered"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : order.status === "shipped"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : order.status === "processing"
                                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                      : order.status === "cancelled"
                                        ? "bg-red-50 text-red-600 border-red-200"
                                        : "bg-gray-50 text-gray-600 border-gray-200"
                              }`}
                            >
                              {order.status || "Pending"}
                            </span>
                          </td>
                          <td className="p-5">
                            <span className="text-xs uppercase tracking-wide bg-gray-100 px-2 py-1">
                              {order.payment_provider?.replace("_", " ") ||
                                "N/A"}
                            </span>
                          </td>
                          <td className="p-5">
                            <div className="text-xs text-gray-500">
                              <p>
                                {new Date(
                                  order.created_at,
                                ).toLocaleDateString()}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {new Date(order.created_at).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                              </p>
                            </div>
                          </td>
                          <td className="p-5 text-right">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden grid grid-cols-1 gap-0">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 border-b border-gray-100"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex gap-4 items-start">
                        <div className="w-16 h-16 bg-gray-100 flex-shrink-0 border border-gray-200 overflow-hidden">
                          {order.items?.[0]?.image ? (
                            <img
                              src={order.items[0].image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-xs font-bold uppercase">
                                {order.shipping_info?.fullName || "N/A"}
                              </p>
                              <p className="text-[10px] font-mono text-gray-400">
                                #{String(order.id).slice(0, 8)}
                              </p>
                            </div>
                            <span className="text-sm font-medium">
                              ${Number(order.total_price).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span
                              className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider ${
                                order.status === "delivered"
                                  ? "bg-green-50 text-green-700"
                                  : order.status === "shipped"
                                    ? "bg-blue-50 text-blue-700"
                                    : order.status === "processing"
                                      ? "bg-yellow-50 text-yellow-700"
                                      : order.status === "cancelled"
                                        ? "bg-red-50 text-red-600"
                                        : "bg-gray-50 text-gray-600"
                              }`}
                            >
                              {order.status || "Pending"}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400">
                              <Clock className="w-3 h-3" />
                              {new Date(order.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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

        {/* KEY PROP FORCES RESET: This ensures ProductDrawer re-mounts when switching products */}
        <ProductDrawer
          key={editingProduct?.id || "new"}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          product={editingProduct}
          onSave={handleSave}
        />
      </main>
    </div>
  );
};

export default Dashboard;
