import React from "react";
import { LayoutDashboard, Package, ShoppingBag } from "lucide-react";

const Sidebar = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isMobileOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsMobileOpen(false)}
      ></div>

      <aside
        className={`
        fixed top-0 left-0 h-full w-64 bg-black text-white z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col justify-between
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div>
          <div className="p-8 border-b border-gray-800">
            <h1 className="text-2xl font-bold tracking-widest uppercase text-white">
              Vraxia<span className="text-gray-500">.Admin</span>
            </h1>
          </div>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center p-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 group
                  ${activeTab === item.id ? "bg-white text-black translate-x-2" : "text-gray-400 hover:text-white hover:bg-gray-900"}
                `}
              >
                <item.icon
                  className={`w-4 h-4 mr-3 transition-transform duration-300 ${activeTab === item.id ? "scale-110" : "group-hover:scale-110"}`}
                />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-bold">
              AD
            </div>
            <div>
              <p className="text-xs font-bold uppercase">Admin</p>
              <p className="text-[10px] text-gray-500">View Profile</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
