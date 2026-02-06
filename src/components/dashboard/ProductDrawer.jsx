import React, { useState } from "react";
import {
  X,
  Package,
  Trash2,
  Settings,
  Image as ImageIcon,
  List,
  Plus,
} from "lucide-react";
import CustomSelect from "./CustomSelect";
import CategorySelector from "./CategorySelector";

const ProductDrawer = ({ isOpen, onClose, product, onSave }) => {
  // Define default structure
  const emptyProduct = {
    title: "",
    price: "",
    category: [],
    stock: 0,
    description: "",
    details: [],
    images: [],
    options: [],
  };

  // Lazy Initialization to prevent double render & ensure 'category' is array
  const [formData, setFormData] = useState(() => {
    if (product) {
      return {
        ...emptyProduct,
        ...product,
        category: Array.isArray(product.category)
          ? product.category
          : [product.category],
        details: product.details || [],
        images: product.images || [],
        options: product.options || [],
      };
    } else {
      return emptyProduct;
    }
  });

  // Handlers
  const handleImageChange = (index, value) => {
    const n = [...formData.images];
    n[index] = value;
    setFormData({ ...formData, images: n });
  };
  const addImageField = () =>
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  const removeImageField = (i) =>
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== i),
    }));

  const handleDetailChange = (index, value) => {
    const n = [...formData.details];
    n[index] = value;
    setFormData({ ...formData, details: n });
  };
  const addDetailField = () =>
    setFormData((prev) => ({ ...prev, details: [...prev.details, ""] }));
  const removeDetailField = (i) =>
    setFormData((prev) => ({
      ...prev,
      details: prev.details.filter((_, idx) => idx !== i),
    }));

  // Options Logic
  const addOption = () => {
    if (formData.options.length < 3) {
      setFormData((prev) => ({
        ...prev,
        options: [...prev.options, { name: "", type: "text", values: [] }],
      }));
    }
  };
  const removeOption = (i) => {
    const n = [...formData.options];
    n.splice(i, 1);
    setFormData({ ...formData, options: n });
  };
  const updateOptionMeta = (i, f, v) => {
    const n = [...formData.options];
    n[i][f] = v;
    if (f === "type") n[i].values = [];
    setFormData({ ...formData, options: n });
  };
  const addOptionValue = (i) => {
    const n = [...formData.options];
    n[i].values.push(n[i].type === "color" ? { label: "", value: "" } : "");
    setFormData({ ...formData, options: n });
  };
  const removeOptionValue = (oi, vi) => {
    const n = [...formData.options];
    n[oi].values.splice(vi, 1);
    setFormData({ ...formData, options: n });
  };
  const updateOptionValue = (oi, vi, f, v) => {
    const n = [...formData.options];
    if (n[oi].type === "color") n[oi].values[vi][f] = v;
    else n[oi].values[vi] = v;
    setFormData({ ...formData, options: n });
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-[60] backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-[70] shadow-2xl flex flex-col animation-slide-in-right border-l border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white">
          <h2 className="text-xl font-light uppercase tracking-widest">
            {product ? "Edit Product" : "New Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-10 custom-scrollbar">
          {/* 1. Basic Information */}
          <section className="space-y-6">
            <h3 className="flex items-center text-xs font-bold uppercase tracking-widest border-b border-gray-100 pb-2 text-gray-400">
              <Package className="w-4 h-4 mr-2" /> Basic Details
            </h3>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-500">
                Product Title
              </label>
              <input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border border-gray-200 p-3 text-sm focus:border-black focus:outline-none transition-colors"
                placeholder="e.g. Structured Linen Coat"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-500">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full border border-gray-200 p-3 text-sm focus:border-black focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-500">
                  Stock
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  className="w-full border border-gray-200 p-3 text-sm focus:border-black focus:outline-none transition-colors"
                />
              </div>

              {/* Multi-Select Category */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-500">
                  Category
                </label>
                <CategorySelector
                  selectedCategories={formData.category}
                  onChange={(newCats) =>
                    setFormData({ ...formData, category: newCats })
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-500">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border border-gray-200 p-3 text-sm focus:border-black focus:outline-none transition-colors"
                rows="4"
                placeholder="Product description..."
              ></textarea>
            </div>
          </section>

          {/* 2. Options & Variants */}
          <section className="space-y-6">
            <h3 className="flex items-center text-xs font-bold uppercase tracking-widest border-b border-gray-100 pb-2 text-gray-400">
              <Settings className="w-4 h-4 mr-2" /> Options & Variants
            </h3>

            {formData.options.map((opt, optIdx) => (
              <div
                key={optIdx}
                className="bg-gray-50 border border-gray-200 p-5 relative group"
              >
                {/* Close Button at Top Right */}
                <button
                  onClick={() => removeOption(optIdx)}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 transition-colors z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pr-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">
                      Option Name
                    </label>
                    <input
                      value={opt.name}
                      onChange={(e) =>
                        updateOptionMeta(optIdx, "name", e.target.value)
                      }
                      className="w-full border border-gray-200 p-2 text-sm focus:border-black focus:outline-none bg-white"
                      placeholder="e.g. Color"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">
                      Type
                    </label>
                    <CustomSelect
                      value={opt.type}
                      onChange={(e) =>
                        updateOptionMeta(optIdx, "type", e.target.value)
                      }
                      options={[
                        { label: "Text (Size, etc.)", value: "text" },
                        { label: "Color Swatch", value: "color" },
                      ]}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Values
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {opt.values.map((val, valIdx) => (
                      <div
                        key={valIdx}
                        className="flex gap-1 items-center bg-white border border-gray-200 p-1 pr-2 shadow-sm"
                      >
                        {opt.type === "color" ? (
                          <>
                            <input
                              value={val.label}
                              onChange={(e) =>
                                updateOptionValue(
                                  optIdx,
                                  valIdx,
                                  "label",
                                  e.target.value,
                                )
                              }
                              className="w-[80px] border-none p-1 text-xs focus:ring-0 focus:outline-none"
                              placeholder="Label"
                            />
                            <div className="w-[1px] h-4 bg-gray-200"></div>
                            <input
                              value={val.value}
                              onChange={(e) =>
                                updateOptionValue(
                                  optIdx,
                                  valIdx,
                                  "value",
                                  e.target.value,
                                )
                              }
                              className="w-[60px] border-none p-1 text-xs focus:ring-0 focus:outline-none font-mono uppercase"
                              placeholder="#HEX"
                            />
                            <div
                              className="w-4 h-4 border border-gray-200"
                              style={{ backgroundColor: val.value || "#fff" }}
                            ></div>
                          </>
                        ) : (
                          <input
                            value={val}
                            onChange={(e) =>
                              updateOptionValue(
                                optIdx,
                                valIdx,
                                null,
                                e.target.value,
                              )
                            }
                            className="w-[140px] border-none p-1 text-xs focus:ring-0 focus:outline-none"
                            placeholder="Value"
                          />
                        )}
                        <button
                          onClick={() => removeOptionValue(optIdx, valIdx)}
                          className="ml-1 text-gray-400 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addOptionValue(optIdx)}
                    className="text-[10px] font-bold uppercase border-b border-black pb-0.5 hover:opacity-60 transition-opacity mt-3 inline-block"
                  >
                    + Add Value
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addOption}
              className="w-full py-3 border border-dashed border-gray-300 text-xs font-bold uppercase text-gray-400 hover:text-black hover:border-black transition-colors"
            >
              + Add New Option Group
            </button>
          </section>

          {/* 3. Media & Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-4">
              <h3 className="flex items-center text-xs font-bold uppercase tracking-widest border-b border-gray-100 pb-2 text-gray-400">
                <ImageIcon className="w-4 h-4 mr-2" /> Images
              </h3>
              {formData.images.map((img, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={img}
                    onChange={(e) => handleImageChange(i, e.target.value)}
                    className="w-full border border-gray-200 p-2 text-sm focus:border-black focus:outline-none"
                    placeholder="Image URL..."
                  />
                  <button onClick={() => removeImageField(i)}>
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              ))}
              <button
                onClick={addImageField}
                className="text-[10px] font-bold uppercase border-b border-black pb-0.5"
              >
                + Add Image
              </button>
            </section>
            <section className="space-y-4">
              <h3 className="flex items-center text-xs font-bold uppercase tracking-widest border-b border-gray-100 pb-2 text-gray-400">
                <List className="w-4 h-4 mr-2" /> Details
              </h3>
              {formData.details.map((d, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={d}
                    onChange={(e) => handleDetailChange(i, e.target.value)}
                    className="w-full border border-gray-200 p-2 text-sm focus:border-black focus:outline-none"
                    placeholder="Detail..."
                  />
                  <button onClick={() => removeDetailField(i)}>
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              ))}
              <button
                onClick={addDetailField}
                className="text-[10px] font-bold uppercase border-b border-black pb-0.5"
              >
                + Add Detail
              </button>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => onSave(formData)}
            className="w-full group relative px-8 py-4 border border-black overflow-hidden bg-black text-white"
          >
            <span className="absolute inset-0 w-full h-full bg-white translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"></span>
            <span className="relative z-10 w-full flex justify-center items-center text-xs font-bold uppercase tracking-widest group-hover:text-black transition-colors duration-300">
              {product ? "Save Changes" : "Create Product"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductDrawer;
