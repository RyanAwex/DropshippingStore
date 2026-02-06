import React, { useState, useEffect } from "react";
import {
  Star,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useProductStore } from "../stores/productStore";
import { useCartStore } from "../stores/cartStore";

const Product = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // --- STORES ---
  const { products, fetchProducts, getProductById, isLoading } = useProductStore();
  const { addToCart, clearCart } = useCartStore();

  // --- STATE ---
  const [selectedImage, setSelectedImage] = useState(0);
  const [selections, setSelections] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState("description");
  const [showPopup, setShowPopup] = useState(false);

  // Fetch products if not loaded
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const product = getProductById(id);

  useEffect(() => {
    if (product && product.options && product.options.length > 0) {
      const initialSelections = {};
      product.options.forEach((opt) => {
        if (opt.values && opt.values.length > 0) {
          initialSelections[opt.name] = opt.values[0].label || opt.values[0];
        }
      });
      setSelections(initialSelections);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen pt-10 pb-20 px-4 md:px-6 max-w-7xl mx-auto flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs uppercase tracking-widest text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white min-h-screen pt-10 pb-20 px-4 md:px-6 max-w-7xl mx-auto text-center">
        <p className="text-gray-500">Product not found</p>
        <button
          onClick={() => navigate("/shop")}
          className="mt-4 px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  // --- HANDLERS ---
  const handleSelection = (optionName, value) => {
    setSelections((prev) => ({ ...prev, [optionName]: value }));
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleAddToCart = () => {
    try {
      addToCart(product, selections, quantity);
      setShowPopup(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleBuyNow = () => {
    try {
      clearCart();
      addToCart(product, selections, quantity);
      navigate('/user/checkout');
    } catch (error) {
      console.log(error.message);
    }
  };

  // add to cart popup
  const AddedPopup = ({ onClose }) => {
    React.useEffect(() => {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 px-6 py-4 rounded shadow-lg flex items-center text-white z-50">
          <h2 className="text-lg font-bold">Added to Cart!</h2>
        </div>
    );
  }

  return (
    // SAFEGUARD 1: overflow-x-hidden prevents horizontal scroll caused by children
    <div className="bg-white min-h-screen pt-4 pb-20 px-4 md:px-6 md:pt-10 w-full max-w-7xl mx-auto overflow-x-hidden">
      
      {/* Scrollbar Hiding Styles */}
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      {/* Nav / Breadcrumbs */}
      <div className="flex items-center justify-between gap-4 mb-6 md:mb-8 w-full">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> 
          {/* SAFEGUARD 3: Simplified text logic without custom 'xs' breakpoint */}
          <span className="inline sm:hidden">Back</span>
          <span className="hidden sm:inline">Return Back</span>
        </button>
        
        <div className="hidden sm:block text-xs uppercase tracking-widest text-gray-400 text-right truncate">
          Home / Shop / {product.category} /{" "}
          <span className="text-black">{product.title}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 w-full">
        
        {/* --- LEFT: IMAGE GALLERY --- */}
        <div className="w-full lg:w-3/5">
          <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
            
            {/* Thumbnails Container */}
            {/* SAFEGUARD: max-w-full ensures this flex child doesn't force expansion */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible no-scrollbar w-full md:w-24 flex-shrink-0 pb-2 md:pb-0 max-w-full">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 aspect-[3/4] md:w-full md:h-32 flex-shrink-0 border transition-all duration-300 
                    ${selectedImage === idx ? "border-black opacity-100 ring-1 ring-black" : "border-transparent opacity-60 hover:opacity-100"}
                  `}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-grow bg-gray-100 aspect-[3/4] relative overflow-hidden w-full">
              <img
                src={product.images[selectedImage]}
                alt="Product View"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-zoom-in"
              />
            </div>
          </div>
        </div>

        {/* --- RIGHT: PRODUCT DETAILS --- */}
        <div className="w-full lg:w-2/5">
          <div className="lg:sticky lg:top-24">
            
            {/* Header */}
            <div className="mb-6 md:mb-8 border-b border-gray-100 pb-6 md:pb-8">
              {/* SAFEGUARD 2: break-words ensures long uppercase titles don't overflow */}
              <h1 className="text-2xl md:text-4xl font-light uppercase tracking-widest leading-tight mb-4 break-words">
                {product.title}
              </h1>

              <div className="flex flex-wrap justify-between items-center gap-4">
                <span className="text-xl md:text-2xl font-medium">
                  ${product.price.toFixed(2)}
                </span>

                {/* <div className="flex items-center gap-2">
                  <div className="flex text-black">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-black" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 underline cursor-pointer hover:text-black">
                    {product.reviews} Reviews
                  </span>
                </div> */}
              </div>
            </div>

            {/* --- DYNAMIC SELECTORS --- */}
            <div className="space-y-6 md:space-y-8 mb-8">
              {product.options.map((option, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-900">
                      {option.name}:{" "}
                      <span className="text-gray-500 font-normal ml-1">
                        {selections[option.name]}
                      </span>
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {option.type === "color" &&
                      option.values.map((color) => (
                        <button
                          key={color.label}
                          onClick={() => handleSelection(option.name, color.label)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 
                            ${selections[option.name] === color.label ? "border-black ring-1 ring-black ring-offset-2" : "border-gray-200 hover:border-gray-400"}
                          `}
                          title={color.label}
                        >
                          <span
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: color.value }}
                          ></span>
                        </button>
                      ))}

                    {option.type === "text" &&
                      option.values.map((val) => (
                        <button
                          key={val}
                          onClick={() => handleSelection(option.name, val)}
                          className={`min-w-[3rem] h-10 px-3 flex items-center justify-center border text-xs font-bold uppercase tracking-wider transition-all duration-200
                            ${selections[option.name] === val ? "bg-black text-white border-black" : "bg-white text-gray-900 border-gray-200 hover:border-black"}
                          `}
                        >
                          {val}
                        </button>
                      ))}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-3 block">
                  Quantity
                </label>
                <div className="flex items-center w-32 border border-gray-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="flex-grow text-center text-sm font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-10 w-full">
              <button onClick={() => {handleAddToCart(product.id, quantity)}} className="w-full cursor-pointer group relative h-14 border border-black overflow-hidden bg-black text-white">
                <span className="absolute inset-0 w-full h-full bg-white translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"></span>
                <span className="relative z-10 w-full flex justify-center items-center text-xs font-bold uppercase tracking-widest group-hover:text-black transition-colors duration-300">
                  Add to Cart
                </span>
              </button>
              <button onClick={() => {handleBuyNow(product.id, quantity)}} className="w-full cursor-pointer group relative h-14 border border-black overflow-hidden bg-white text-black hover:border-2">
                <span className="relative z-10 w-full flex justify-center items-center text-xs font-bold uppercase tracking-widest">
                  Buy It Now
                </span>
              </button>
            </div>

            {/* Accordions */}
            <div className="border-t border-gray-200">
              {[
                { id: "description", label: "Description", content: <p>{product.description}</p> },
                { id: "material", label: "Material & Care", content: <ul className="list-disc list-inside space-y-1">{product.details.map((d, i) => <li key={i}>{d}</li>)}</ul> },
                { id: "shipping", label: "Shipping & Returns", content: <p>Free shipping on orders over $100. Returns accepted within 30 days.</p> }
              ].map((section) => (
                <div key={section.id} className="border-b border-gray-200">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full py-4 flex justify-between items-center text-xs font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
                  >
                    <span>{section.label}</span>
                    {openSection === section.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === section.id ? "max-h-96 opacity-100 mb-4" : "max-h-0 opacity-0"}`}>
                    <div className="text-sm text-gray-500 leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {showPopup && <AddedPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default Product;