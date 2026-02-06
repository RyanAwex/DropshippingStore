import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, SlidersHorizontal, X, Check, Loader, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useProductStore } from "../stores/productStore";

const Shop = () => {
  const { products, fetchProducts, isLoading: productsLoading } = useProductStore();
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  // --- STATE FOR FILTERS ---
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [sortOption, setSortOption] = useState("newest"); // newest, price-asc, price-desc

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- 1. DYNAMIC CATEGORY EXTRACTION ---
  // We use useMemo so we don't recalculate this on every render
  const uniqueCategories = useMemo(() => {
    // Handle both array and string category formats
    const allCategories = products.flatMap((p) => 
      Array.isArray(p.category) ? p.category : [p.category]
    );
    return [...new Set(allCategories.filter(Boolean))];
  }, [products]);

  // --- 2. FILTERING & SORTING LOGIC (using useMemo instead of useEffect) ---
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // A. Filter by Category (handle both array and string formats)
    if (selectedCategories.length > 0) {
      result = result.filter((p) => {
        const productCategories = Array.isArray(p.category) ? p.category : [p.category];
        return selectedCategories.some(cat => productCategories.includes(cat));
      });
    }

    // B. Filter by Price
    if (selectedPriceRanges.length > 0) {
      result = result.filter((p) => {
        return selectedPriceRanges.some((range) => {
          if (range === "0-50") return p.price >= 0 && p.price <= 50;
          if (range === "50-100") return p.price > 50 && p.price <= 100;
          if (range === "100-200") return p.price > 100 && p.price <= 200;
          if (range === "200+") return p.price > 200;
          return false;
        });
      });
    }

    // C. Sort
    if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else {
      // Default: Newest (by created_at or id)
      result.sort((a, b) => {
        if (a.created_at && b.created_at) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        return b.id - a.id;
      });
    }

    return result;
  }, [selectedCategories, selectedPriceRanges, sortOption, products]);

  // --- HANDLERS ---
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setVisibleCount(6); // Reset pagination when filter changes
  };

  const togglePrice = (range) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(range)
        ? prev.filter((r) => r !== range)
        : [...prev, range]
    );
    setVisibleCount(6); // Reset pagination when filter changes
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    setVisibleCount(6); // Reset pagination when sort changes
    setIsSortOpen(false);
  };

  const loadMore = () => {
    if (visibleCount >= filteredProducts.length) return;
    setIsLoading(true);
    // Simulate loading even if fast
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 6, filteredProducts.length));
      setIsLoading(false);
    }, 500); // 500ms delay
  };

  const sortLabel = {
    "newest": "Newest First",
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low"
  };

  return (
    <div className="bg-white min-h-screen pt-10 pb-20 px-6 max-w-7xl mx-auto">
      
      {/* Return Home Button */}
      <Link to="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </Link>
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end mb-12 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-light uppercase tracking-widest mb-2">
            All Products
          </h1>
          <p className="text-gray-400 text-xs uppercase tracking-wider">
            Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} results
          </p>
        </div>

        <div className="flex items-center gap-4 mt-6 md:mt-0 relative">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center space-x-2 border border-gray-200 px-4 py-2 uppercase text-xs font-bold tracking-widest"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Custom Sort Dropdown */}
          <div className="relative">
            <span className="text-xs uppercase tracking-wide text-gray-500 mr-2 hidden sm:inline">Sort By:</span>
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="group relative cursor-pointer border border-gray-200 px-4 py-2 overflow-hidden bg-white inline-flex items-center min-w-[160px] justify-between"
            >
              <span className="absolute inset-0 w-full h-full bg-black translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"></span>
              <span className="relative z-10 text-xs font-bold uppercase tracking-widest text-black group-hover:text-white transition-colors duration-300">
                {sortLabel[sortOption]}
              </span>
              <ChevronDown className="relative z-10 w-4 h-4 ml-2 text-black group-hover:text-white transition-colors" />
            </button>
            
            {/* Sort Menu Overlay */}
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-1 w-full bg-white border border-gray-200 shadow-lg z-50">
                {Object.keys(sortLabel).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleSortChange(key)}
                    className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors ${sortOption === key ? 'text-black bg-gray-50' : 'text-gray-500'}`}
                  >
                    {sortLabel[key]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-12">
        {/* Sidebar Filters */}
        <aside
          className={`
          w-64 flex-shrink-0 bg-white z-40 transition-all duration-300
          ${isFilterOpen ? "fixed inset-0 p-6 overflow-y-auto" : "hidden md:block"}
        `}
        >
          <div className="flex justify-between md:hidden mb-8">
            <span className="text-xl font-bold uppercase tracking-widest">
              Filters
            </span>
            <X
              className="w-6 h-6 cursor-pointer"
              onClick={() => setIsFilterOpen(false)}
            />
          </div>

          {/* Dynamic Category Filter */}
          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-2 mb-4">
              Category
            </h3>
            <ul className="space-y-3 text-sm text-gray-500">
              {(showAllCategories ? uniqueCategories : uniqueCategories.slice(0, 5)).map((cat) => (
                <li key={cat} className="flex items-center">
                  <div 
                    onClick={() => toggleCategory(cat)}
                    className="flex items-center cursor-pointer group"
                  >
                    <div className={`w-4 h-4 border border-gray-300 mr-3 flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'bg-black border-black' : 'group-hover:border-black'}`}>
                       {selectedCategories.includes(cat) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`transition-colors ${selectedCategories.includes(cat) ? 'text-black font-medium' : 'group-hover:text-black'}`}>
                      {cat}
                    </span>
                  </div>
                </li>
              ))}
              {uniqueCategories.length > 5 && !showAllCategories && (
                <li>
                  <button 
                    onClick={() => setShowAllCategories(true)}
                    className="text-xs font-bold uppercase tracking-widest text-black hover:text-gray-600 transition-colors"
                  >
                    See More
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Functional Price Filter */}
          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-2 mb-4">
              Price Range
            </h3>
            <div className="space-y-3 text-sm text-gray-500">
              {["0-50", "50-100", "100-200", "200+"].map((range) => (
                <label key={range} className="flex items-center cursor-pointer group">
                   <div 
                    onClick={() => togglePrice(range)}
                    className={`w-4 h-4 border border-gray-300 mr-3 flex items-center justify-center transition-colors ${selectedPriceRanges.includes(range) ? 'bg-black border-black' : 'group-hover:border-black'}`}
                   >
                     {selectedPriceRanges.includes(range) && <Check className="w-3 h-3 text-white" />}
                   </div>
                   <span className={`transition-colors ${selectedPriceRanges.includes(range) ? 'text-black font-medium' : 'group-hover:text-black'}`}>
                      {range === "200+" ? "$200+" : `$${range.replace('-', ' - $')}`}
                   </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {/* Loading State */}
          {productsLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xs uppercase tracking-widest text-gray-400">Loading products...</p>
              </div>
            </div>
          )}

          {!productsLoading && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {filteredProducts.slice(0, visibleCount).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : !productsLoading && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm uppercase tracking-widest">No products found matching your filters.</p>
              <button 
                onClick={() => { setSelectedCategories([]); setSelectedPriceRanges([]); }}
                className="mt-4 text-xs font-bold border-b border-black pb-1 hover:text-gray-600"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Load More Button (Only show if there are more products to load) */}
          {visibleCount < filteredProducts.length && (
            <div className="flex justify-center mt-20">
              <button 
                onClick={loadMore}
                disabled={isLoading}
                className="group relative px-12 py-3 border border-black overflow-hidden bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 w-full h-full bg-black translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"></span>
                <span className="relative z-10 flex items-center text-xs font-bold uppercase tracking-widest text-black group-hover:text-white transition-colors duration-300">
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;