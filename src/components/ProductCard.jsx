import React from 'react'
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <Link to={`/shop/product/${product.id}`} className="group max-w-xs w-full mx-auto">
      {/* Image Container - Strictly Square & Fixed Max Width */}
      <div className="w-full aspect-square bg-gray-100 mb-4 overflow-hidden relative">
        <img 
          src={product.images[0]} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        {/* Hover Overlay */}
        <button className="absolute cursor-pointer bottom-0 w-full bg-black backdrop-blur-sm text-white py-4 text-xs font-bold uppercase tracking-widest text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
          See Product Details
        </button>
      </div>

      {/* Product Details */}
      <div className="text-left">
        <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900">{product.title}</h3>
        <p className="text-gray-500 text-sm mt-1">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}

export default ProductCard
