import React, { useState } from 'react';
import { 
  User, 
  Package, 
  Star, 
  LogOut, 
  ChevronRight, 
  MapPin, 
  CreditCard 
} from 'lucide-react';

// --- MOCK DATA ---
const mockUser = {
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  joined: "Member since 2024"
};

const mockOrders = [
  { 
    id: "#VRX-9928", 
    date: "Jan 24, 2026", 
    status: "Processing", 
    total: 345.00, 
    items: ["Structured Linen Coat", "Minimalist Vase"] 
  },
  { 
    id: "#VRX-8821", 
    date: "Dec 12, 2025", 
    status: "Delivered", 
    total: 210.00, 
    items: ["Leather Trainer"] 
  },
  { 
    id: "#VRX-7734", 
    date: "Nov 08, 2025", 
    status: "Delivered", 
    total: 85.00, 
    items: ["Wool Scarf", "Ceramic Mug"] 
  }
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="bg-white min-h-screen pt-10 pb-20 px-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="mb-12 border-b border-gray-100 pb-6">
        <h1 className="text-3xl md:text-4xl font-light uppercase tracking-widest mb-2">My Account</h1>
        <p className="text-gray-400 text-xs uppercase tracking-wider">Welcome back, {mockUser.name}</p>
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
              <h2 className="text-sm font-bold uppercase tracking-widest">{mockUser.name}</h2>
              <p className="text-xs text-gray-500 mt-1">{mockUser.email}</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{mockUser.joined}</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between p-4 border-l-2 text-xs font-bold uppercase tracking-widest transition-all
                ${activeTab === 'orders' ? 'border-black bg-gray-50 text-black' : 'border-transparent text-gray-400 hover:text-black hover:bg-gray-50'}
              `}
            >
              <span className="flex items-center"><Package className="w-4 h-4 mr-3" /> Orders</span>
              <ChevronRight className="w-3 h-3" />
            </button>

            <button 
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center justify-between p-4 border-l-2 text-xs font-bold uppercase tracking-widest transition-all
                ${activeTab === 'reviews' ? 'border-black bg-gray-50 text-black' : 'border-transparent text-gray-400 hover:text-black hover:bg-gray-50'}
              `}
            >
              <span className="flex items-center"><Star className="w-4 h-4 mr-3" /> Reviews</span>
              <ChevronRight className="w-3 h-3" />
            </button>

            {/* Visual placeholders for other common settings */}
            <button disabled className="w-full flex items-center justify-between p-4 border-l-2 border-transparent text-xs font-bold uppercase tracking-widest text-gray-300 cursor-not-allowed">
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-3" /> Addresses</span>
            </button>

            <button className="w-full flex items-center justify-between p-4 border-l-2 border-transparent text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors mt-8">
              <span className="flex items-center"><LogOut className="w-4 h-4 mr-3" /> Sign Out</span>
            </button>
          </nav>
        </aside>


        {/* --- RIGHT CONTENT AREA --- */}
        <main className="flex-grow">
          
          {/* TAB: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animation-fade-in">
              <h3 className="text-xl font-light uppercase tracking-widest mb-8">Order History</h3>
              
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 p-6 hover:border-black transition-colors group">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-bold uppercase tracking-widest">{order.id}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">{order.date}</p>
                      </div>
                      <span className="text-lg font-light">${order.total.toFixed(2)}</span>
                    </div>

                    <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        {order.items.map((item, i) => (
                          <p key={i} className="text-xs text-gray-500 uppercase tracking-wide flex items-center">
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                            {item}
                          </p>
                        ))}
                      </div>
                      
                      <button className="px-6 py-2 border border-gray-200 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: REVIEWS (Coming Soon) */}
          {activeTab === 'reviews' && (
            <div className="h-full flex flex-col items-center justify-center text-center border border-dashed border-gray-200 p-12 lg:min-h-[400px] animation-fade-in bg-gray-50">
              <div className="w-16 h-16 bg-white border border-gray-200 flex items-center justify-center mb-6 rounded-full">
                <Star className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-2">My Reviews</h3>
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