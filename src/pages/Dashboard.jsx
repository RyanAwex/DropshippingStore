import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Search,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Box,
  Users,
  Image as ImageIcon,
  List,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { products as initialProductsData } from '../utils/products';

// --- UTILS & COMPONENTS ---

// 1. Toast Notification
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 shadow-2xl animation-slide-up border-l-4 ${type === 'success' ? 'bg-white border-black' : 'bg-white border-red-500'}`}>
      {type === 'success' ? <CheckCircle className="w-5 h-5 text-black" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
      <span className="text-xs font-bold uppercase tracking-widest text-black">{message}</span>
    </div>
  );
};

// 2. Custom Select Component (Fixes alignment and appearance)
const CustomSelect = ({ value, onChange, options, placeholder = "Select..." }) => (
  <div className="relative w-full group">
    <select 
      value={value} 
      onChange={onChange} 
      className="w-full appearance-none border border-gray-200 p-3 pr-10 text-sm bg-white focus:border-black focus:outline-none rounded-none cursor-pointer transition-colors"
    >
      <option value="" disabled>{placeholder}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-black transition-colors" />
  </div>
);

// 3. Stat Card
const StatCard = ({ label, value, icon: Icon, trend }) => (
  <div className="bg-white p-6 border border-gray-200 hover:border-black transition-all duration-300 group relative overflow-hidden">
    <div className="relative z-10 flex justify-between items-start mb-4">
      <div className="p-3 bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors duration-300">
        {Icon && <Icon className="w-5 h-5" />}
      </div>
      {trend && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 uppercase tracking-wider">{trend}</span>}
    </div>
    <h3 className="relative z-10 text-3xl font-light mb-1">{value}</h3>
    <p className="relative z-10 text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">{label}</p>
  </div>
);

// --- SIDEBAR ---
const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsMobileOpen(false)}
      ></div>

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-black text-white z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col justify-between
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          <div className="p-8 border-b border-gray-800">
            <h1 className="text-2xl font-bold tracking-widest uppercase text-white">Vraxia<span className="text-gray-500">.Admin</span></h1>
          </div>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileOpen(false); }}
                className={`w-full flex items-center p-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 group
                  ${activeTab === item.id ? 'bg-white text-black translate-x-2' : 'text-gray-400 hover:text-white hover:bg-gray-900'}
                `}
              >
                <item.icon className={`w-4 h-4 mr-3 transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6 border-t border-gray-800">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-bold">AD</div>
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

// --- PRODUCT DRAWER ---
const ProductDrawer = ({ isOpen, onClose, product, onSave }) => {
  const emptyProduct = {
    title: '', price: '', category: '', rating: 0, reviews: 0, stock: 0,
    description: '', details: [], images: [], options: []
  };

  const [formData, setFormData] = useState(() => {
    if (product) {
      return {
        ...emptyProduct,
        ...product,
        details: product.details || [],
        images: product.images || [],
        options: product.options || []
      };
    } else {
      return emptyProduct;
    }
  });

  // Image & Details Handlers
  const handleImageChange = (index, value) => { const n = [...formData.images]; n[index] = value; setFormData({ ...formData, images: n }); };
  const addImageField = () => setFormData(prev => ({ ...prev, images: [...prev.images, ""] }));
  const removeImageField = (i) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));

  const handleDetailChange = (index, value) => { const n = [...formData.details]; n[index] = value; setFormData({ ...formData, details: n }); };
  const addDetailField = () => setFormData(prev => ({ ...prev, details: [...prev.details, ""] }));
  const removeDetailField = (i) => setFormData(prev => ({ ...prev, details: prev.details.filter((_, idx) => idx !== i) }));

  // Options Logic
  const addOption = () => setFormData(prev => ({ ...prev, options: [...prev.options, { name: '', type: 'text', values: [] }] }));
  const removeOption = (i) => { const n = [...formData.options]; n.splice(i, 1); setFormData({ ...formData, options: n }); };
  const updateOptionMeta = (i, f, v) => { const n = [...formData.options]; n[i][f] = v; if(f==='type') n[i].values=[]; setFormData({ ...formData, options: n }); };
  const addOptionValue = (i) => { const n = [...formData.options]; n[i].values.push(n[i].type === 'color' ? { label: '', value: '' } : ''); setFormData({ ...formData, options: n }); };
  const removeOptionValue = (oi, vi) => { const n = [...formData.options]; n[oi].values.splice(vi, 1); setFormData({ ...formData, options: n }); };
  const updateOptionValue = (oi, vi, f, v) => { const n = [...formData.options]; if(n[oi].type==='color') n[oi].values[vi][f] = v; else n[oi].values[vi] = v; setFormData({ ...formData, options: n }); };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-[60] backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-[70] shadow-2xl flex flex-col animation-slide-in-right border-l border-gray-100">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white">
          <h2 className="text-xl font-light uppercase tracking-widest">{product ? 'Edit Product' : 'New Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-10 custom-scrollbar">
          
          {/* 1. Basic Information */}
          <section className="space-y-6">
            <h3 className="flex items-center text-xs font-bold uppercase tracking-widest border-b border-gray-100 pb-2 text-gray-400">
              <Package className="w-4 h-4 mr-2" /> Basic Details
            </h3>
            
            <div className="space-y-1">
               <label className="text-[10px] font-bold uppercase text-gray-500">Product Title</label>
               <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-200 p-3 text-sm focus:border-black focus:outline-none transition-colors" placeholder="e.g. Structured Linen Coat" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="space-y-1">
                 <label className="text-[10px] font-bold uppercase text-gray-500">Price ($)</label>
                 <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-200 p-3 text-sm focus:border-black focus:outline-none transition-colors" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-bold uppercase text-gray-500">Category</label>
                 <CustomSelect 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    options={[
                        { label: 'Apparel', value: 'Apparel' },
                        { label: 'Footwear', value: 'Footwear' },
                        { label: 'Living', value: 'Living' },
                        { label: 'Accessories', value: 'Accessories' },
                        { label: 'Tech', value: 'Tech' },
                        { label: 'Kitchen', value: 'Kitchen' }
                    ]}
                 />
               </div>
            </div>

            <div className="space-y-1">
               <label className="text-[10px] font-bold uppercase text-gray-500">Description</label>
               <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-200 p-3 text-sm focus:border-black focus:outline-none transition-colors" rows="4" placeholder="Product description..."></textarea>
            </div>
          </section>

          {/* 2. Options & Variants */}
          <section className="space-y-6">
            <h3 className="flex items-center text-xs font-bold uppercase tracking-widest border-b border-gray-100 pb-2 text-gray-400">
              <Settings className="w-4 h-4 mr-2" /> Options & Variants
            </h3>
            
            {formData.options.map((opt, optIdx) => (
              <div key={optIdx} className="bg-gray-50 border border-gray-200 p-5 relative group">
                {/* Close Button at Top Right (Fixed) */}
                <button 
                  onClick={() => removeOption(optIdx)} 
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 transition-colors z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                {/* Option Header */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pr-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Option Name</label>
                    <input 
                      value={opt.name} 
                      onChange={(e) => updateOptionMeta(optIdx, 'name', e.target.value)} 
                      className="w-full border border-gray-200 p-2 text-sm focus:border-black focus:outline-none bg-white" 
                      placeholder="e.g. Color" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Type</label>
                    <CustomSelect 
                        value={opt.type} 
                        onChange={(e) => updateOptionMeta(optIdx, 'type', e.target.value)}
                        options={[ {label: 'Text (Size, etc.)', value: 'text'}, {label: 'Color Swatch', value: 'color'} ]}
                    />
                  </div>
                </div>

                {/* Option Values List */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Values</label>
                  <div className="flex flex-wrap gap-3">
                    {opt.values.map((val, valIdx) => (
                      <div key={valIdx} className="flex gap-1 items-center bg-white border border-gray-200 p-1 pr-2 shadow-sm">
                        {opt.type === 'color' ? (
                          <>
                            <input 
                              value={val.label} 
                              onChange={(e) => updateOptionValue(optIdx, valIdx, 'label', e.target.value)} 
                              className="w-[80px] border-none p-1 text-xs focus:ring-0 focus:outline-none" 
                              placeholder="Label" 
                            />
                            <div className="w-[1px] h-4 bg-gray-200"></div>
                            <input 
                              value={val.value} 
                              onChange={(e) => updateOptionValue(optIdx, valIdx, 'value', e.target.value)} 
                              className="w-[60px] border-none p-1 text-xs focus:ring-0 focus:outline-none font-mono uppercase" 
                              placeholder="#HEX" 
                            />
                            <div className="w-4 h-4 border border-gray-200" style={{ backgroundColor: val.value || '#fff' }}></div>
                          </>
                        ) : (
                          <input 
                            value={val} 
                            onChange={(e) => updateOptionValue(optIdx, valIdx, null, e.target.value)} 
                            className="w-[140px] border-none p-1 text-xs focus:ring-0 focus:outline-none" 
                            placeholder="Value" 
                          />
                        )}
                        <button onClick={() => removeOptionValue(optIdx, valIdx)} className="ml-1 text-gray-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => addOptionValue(optIdx)} className="text-[10px] font-bold uppercase border-b border-black pb-0.5 hover:opacity-60 transition-opacity mt-3 inline-block">
                    + Add Value
                  </button>
                </div>
              </div>
            ))}
            
            <button onClick={addOption} className="w-full py-3 border border-dashed border-gray-300 text-xs font-bold uppercase text-gray-400 hover:text-black hover:border-black transition-colors">
              + Add New Option Group
            </button>
          </section>

           {/* 3. Media & Details */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="space-y-4">
                    <h3 className="flex items-center text-xs font-bold uppercase tracking-widest border-b border-gray-100 pb-2 text-gray-400"><ImageIcon className="w-4 h-4 mr-2" /> Images</h3>
                    {formData.images.map((img, i) => (
                        <div key={i} className="flex gap-2">
                            <input value={img} onChange={(e) => handleImageChange(i, e.target.value)} className="w-full border border-gray-200 p-2 text-sm focus:border-black focus:outline-none" placeholder="Image URL..." />
                            <button onClick={() => removeImageField(i)}><Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" /></button>
                        </div>
                    ))}
                    <button onClick={addImageField} className="text-[10px] font-bold uppercase border-b border-black pb-0.5">+ Add Image</button>
                </section>
                <section className="space-y-4">
                    <h3 className="flex items-center text-xs font-bold uppercase tracking-widest border-b border-gray-100 pb-2 text-gray-400"><List className="w-4 h-4 mr-2" /> Details</h3>
                    {formData.details.map((d, i) => (
                        <div key={i} className="flex gap-2">
                            <input value={d} onChange={(e) => handleDetailChange(i, e.target.value)} className="w-full border border-gray-200 p-2 text-sm focus:border-black focus:outline-none" placeholder="Detail..." />
                            <button onClick={() => removeDetailField(i)}><Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" /></button>
                        </div>
                    ))}
                    <button onClick={addDetailField} className="text-[10px] font-bold uppercase border-b border-black pb-0.5">+ Add Detail</button>
                </section>
           </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button onClick={() => onSave(formData)} className="w-full group relative px-8 py-4 border border-black overflow-hidden bg-black text-white">
            <span className="absolute inset-0 w-full h-full bg-white translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"></span>
            <span className="relative z-10 w-full flex justify-center items-center text-xs font-bold uppercase tracking-widest group-hover:text-black transition-colors duration-300">
               {product ? 'Save Changes' : 'Create Product'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

// --- MAIN DASHBOARD ---
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Lazy state initialization to prevent double-render/flash
  const [products, setProducts] = useState(() => {
    return initialProductsData.map(p => ({
       ...p, 
       stock: p.stock !== undefined ? p.stock : 0 
    }));
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState(null);

  const handleSave = (data) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...data, id: p.id } : p));
      setToast({ message: "Product Updated", type: "success" });
    } else {
      setProducts([...products, { ...data, id: Date.now() }]);
      setToast({ message: "Product Created", type: "success" });
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = (id) => {
    if(window.confirm("Delete this product?")) {
        setProducts(products.filter(p => p.id !== id));
        setToast({ message: "Product Deleted", type: "success" });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="flex-1 lg:ml-64 p-6 lg:p-12 transition-all duration-300">
        <div className="lg:hidden mb-8 flex justify-between items-center">
          <span className="text-xl font-bold uppercase tracking-widest">Vraxia Admin</span>
          <button onClick={() => setIsMobileOpen(true)} className="p-2 border border-black"><MoreVertical className="w-5 h-5" /></button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-10 animate-fade-in">
             <div className="flex justify-between items-end border-b border-gray-200 pb-6">
                <h1 className="text-4xl font-light uppercase tracking-widest">Dashboard</h1>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 hidden sm:block">Last updated: Just now</p>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Revenue" value="$45,231" icon={DollarSign} trend="+12%" />
                <StatCard label="Total Orders" value="1,205" icon={ShoppingBag} trend="+5%" />
                <StatCard label="Total Products" value={products.length} icon={Box} />
                <StatCard label="Active Users" value="843" icon={Users} />
             </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-gray-200 pb-6">
              <div>
                <h1 className="text-4xl font-light uppercase tracking-widest mb-2">Products</h1>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Manage your catalog & inventory</p>
              </div>
              <button onClick={() => { setEditingProduct(null); setIsDrawerOpen(true); }} className="group relative px-8 py-3 border border-black overflow-hidden bg-black text-white">
                <span className="absolute inset-0 w-full h-full bg-white translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"></span>
                <span className="relative z-10 flex items-center text-xs font-bold uppercase tracking-widest group-hover:text-black transition-colors duration-300">
                  <Plus className="w-4 h-4 mr-2" /> Add Product
                </span>
              </button>
            </div>

            {/* Product Table / Grid */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-black bg-gray-50">
                      <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Image</th>
                      <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product Name</th>
                      <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                      <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</th>
                      <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Stock</th>
                      <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                        <td className="p-5">
                          <div className="w-12 h-12 bg-gray-100 border border-gray-200 overflow-hidden">
                             {product.images && product.images[0] ? <img src={product.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon className="w-4 h-4"/></div>}
                          </div>
                        </td>
                        <td className="p-5 text-xs font-bold uppercase tracking-wide">{product.title}</td>
                        <td className="p-5 text-xs text-gray-500 uppercase tracking-wider">{product.category}</td>
                        <td className="p-5 text-xs font-medium">${Number(product.price).toFixed(2)}</td>
                        <td className="p-5"><span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider ${product.stock < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>{product.stock} Units</span></td>
                        <td className="p-5 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingProduct(product); setIsDrawerOpen(true); }} className="p-2 border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all"><Pencil className="w-3 h-3" /></button>
                            <button onClick={() => handleDelete(product.id)} className="p-2 border border-gray-200 hover:border-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-3 h-3" /></button>
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
                    <div key={product.id} className="p-4 border-b border-gray-100 flex gap-4 items-center">
                       <div className="w-16 h-20 bg-gray-100 flex-shrink-0">
                          {product.images && product.images[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover" />}
                       </div>
                       <div className="flex-grow">
                          <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">{product.category}</p>
                          <h3 className="text-xs font-bold uppercase mb-2 line-clamp-1">{product.title}</h3>
                          <div className="flex justify-between items-center">
                             <span className="text-sm font-medium">${Number(product.price).toFixed(2)}</span>
                             <div className="flex gap-2">
                                <button onClick={() => { setEditingProduct(product); setIsDrawerOpen(true); }} className="p-2 border border-gray-200"><Pencil className="w-3 h-3" /></button>
                                <button onClick={() => handleDelete(product.id)} className="p-2 border border-gray-200 text-red-500"><Trash2 className="w-3 h-3" /></button>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
            </div>
          </div>
        )}
        
        <ProductDrawer key={editingProduct?.id || 'new'} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} product={editingProduct} onSave={handleSave} />
      </main>
    </div>
  );
};

export default Dashboard;