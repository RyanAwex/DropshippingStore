import React, { useState } from 'react';
import { Trash2, Minus, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Minimalist Vase', price: 45, quantity: 1, image: 'https://placehold.co/150x150/e0e0e0/333' },
    { id: 2, name: 'Linen Throw', price: 85, quantity: 2, image: 'https://placehold.co/150x150/e0e0e0/333' },
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 15;
  const total = subtotal + shipping;

  return (
    <div className="bg-white min-h-screen pt-10 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-light uppercase tracking-widest mb-8 md:mb-12 text-center md:text-left">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* Cart Items List */}
        <div className="flex-grow">
          {cartItems.length === 0 ? (
            <div className="text-center py-20 border-t border-b border-gray-100">
              <p className="text-gray-500 mb-6">Your cart is currently empty.</p>
              <Link to="/" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600">Continue Shopping</Link>
            </div>
          ) : (
            <div className="space-y-6 md:space-y-8">
              
              {/* Table Headers - Hidden on Mobile */}
              <div className="hidden md:grid grid-cols-12 text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-4 mb-4">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              {/* Items */}
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center border-b border-gray-100 pb-6 md:pb-8 gap-4 md:gap-0">
                  
                  {/* Product Info */}
                  <div className="col-span-6 flex gap-4 md:gap-6 w-full">
                    <div className="w-24 h-24 md:w-24 md:h-24 bg-gray-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex flex-col justify-between py-1 w-full">
                      <div className="flex justify-between md:block">
                        <h3 className="text-sm font-bold uppercase tracking-wide">{item.name}</h3>
                        {/* Mobile Price Display */}
                        <span className="md:hidden text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      
                      <p className="hidden md:block text-xs text-gray-500 mt-1">${item.price.toFixed(2)}</p>
                      
                      {/* Mobile Controls Container */}
                      <div className="md:hidden flex justify-between items-center mt-4">
                         <div className="flex items-center border border-gray-200">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-gray-50 text-gray-500"><Minus className="w-3 h-3" /></button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-gray-50 text-gray-500"><Plus className="w-3 h-3" /></button>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="text-xs text-red-400 hover:text-red-600 uppercase tracking-wider flex items-center gap-1">
                             <Trash2 className="w-4 h-4" />
                          </button>
                      </div>

                       {/* Desktop Remove Button */}
                      <button onClick={() => removeItem(item.id)} className="hidden md:flex text-xs text-red-400 hover:text-red-600 uppercase tracking-wider items-center gap-1 w-fit mt-2">
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Desktop Quantity Control */}
                  <div className="hidden md:flex col-span-3 justify-center">
                    <div className="flex items-center border border-gray-200">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-gray-50 text-gray-500"><Minus className="w-3 h-3" /></button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-gray-50 text-gray-500"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>

                  {/* Desktop Item Total */}
                  <div className="hidden md:block col-span-3 text-right">
                    <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}

              <Link to="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black mt-6">
                <ArrowLeft className="w-4 h-4" /> Continue Shopping
              </Link>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-gray-50 p-6 md:p-8">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-8 border-b border-gray-200 pb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-medium mb-8">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <Link to="/checkout" className="w-full group relative px-8 py-4 border border-black overflow-hidden bg-white text-black inline-block">
              <span className="absolute inset-0 w-full h-full bg-black translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"></span>
              <span className="relative z-10 w-full flex justify-between items-center text-xs font-bold uppercase tracking-widest group-hover:text-white transition-colors duration-300">
                <span>Checkout</span>
                <span>${total.toFixed(2)}</span>
              </span>
            </Link>

            <div className="mt-6 text-xs text-gray-400 text-center leading-relaxed">
              Secure Checkout. Taxes calculated at next step.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;