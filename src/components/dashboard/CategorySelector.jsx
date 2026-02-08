import React, { useState } from "react";
import { Plus, X, CheckCircle } from "lucide-react";
import { CATEGORIES } from "../../utils/categories";

const CategorySelector = ({ selectedCategories = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Ensure selectedCategories is always an array
  const safeSelectedCategories = Array.isArray(selectedCategories)
    ? selectedCategories
    : [];

  // Helper to safely check category existence
  const isSelected = (cat) => safeSelectedCategories.includes(cat);

  const toggleCategory = (cat) => {
    if (isSelected(cat)) {
      onChange(safeSelectedCategories.filter((c) => c !== cat));
    } else {
      onChange([...safeSelectedCategories, cat]);
    }
  };

  const removeCategory = (e, cat) => {
    e.stopPropagation();
    onChange(safeSelectedCategories.filter((c) => c !== cat));
  };

  return (
    <>
      {/* Trigger Box */}
      <div
        onClick={() => setIsOpen(true)}
        className="w-full border border-gray-200 p-3 min-h-[50px] flex flex-wrap gap-2 cursor-pointer bg-white hover:border-black transition-colors items-center group"
      >
        {safeSelectedCategories.length === 0 ? (
          <span className="text-sm text-gray-400">Select Categories...</span>
        ) : (
          safeSelectedCategories.map((cat) => (
            <span
              key={cat}
              className="text-[10px] font-bold uppercase bg-gray-100 px-3 py-1 flex items-center gap-2 transition-all hover:bg-gray-200"
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
              <div
                onClick={(e) => removeCategory(e, cat)}
                className="hover:text-red-500 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </div>
            </span>
          ))
        )}
        <div className="ml-auto">
          <Plus className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
        </div>
      </div>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animation-fade-in">
          <div className="bg-white w-full max-w-lg h-[80vh] flex flex-col shadow-2xl animation-scale-in border border-gray-100">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-widest">
                  Select Categories
                </h3>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
                  {safeSelectedCategories.length} Selected
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 content-start custom-scrollbar bg-gray-50/30">
              {CATEGORIES.map((cat) => {
                const active = isSelected(cat);
                return (
                  <div
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`
                      cursor-pointer p-4 border transition-all duration-200 flex items-center justify-between group
                      ${
                        active
                          ? "bg-black text-white border-black shadow-md transform scale-[1.02]"
                          : "bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black"
                      }
                    `}
                  >
                    <span className="text-xs font-bold uppercase tracking-wide">
                      {cat}
                    </span>
                    {active && <CheckCircle className="w-4 h-4" />}
                  </div>
                );
              })}
            </div>

            <div className="p-6 border-t border-gray-100 bg-white">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategorySelector;
