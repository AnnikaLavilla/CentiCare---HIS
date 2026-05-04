import React from 'react';
import { Search, Package, AlertTriangle, CheckCircle, ArrowRightLeft, Plus, Printer, Save, X, FileText, Upload, Download } from 'lucide-react';
import { InventoryItem } from '../types';
import { INVENTORY_ITEMS } from '../constants';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const InventoryModule: React.FC = () => {
  const [items, setItems] = React.useState<InventoryItem[]>(INVENTORY_ITEMS);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filter, setFilter] = React.useState<'All' | 'Medicine' | 'Supply' | 'Equipment' | 'Emergency'>('All');
  const [isSaving, setIsSaving] = React.useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = React.useState(false);
  const [lastRestock, setLastRestock] = React.useState<{ id: string, amount: number } | null>(null);

  const [showBulkImport, setShowBulkImport] = React.useState(false);
  const [showCrashCart, setShowCrashCart] = React.useState(false);
  const [crashCartItems, setCrashCartItems] = React.useState([
    { id: 1, label: 'Epinephrine Vials (10pcs)', checked: false },
    { id: 2, label: 'Atropine Ampules (5pcs)', checked: false },
    { id: 3, label: 'Laryngoscope & Blades', checked: false },
    { id: 4, label: 'Endotracheal Tubes (Full range)', checked: false },
    { id: 5, label: 'Defibrillator Unit Tested', checked: false },
    { id: 6, label: 'IV Fluids (LR/NSS 1L)', checked: false },
    { id: 7, label: 'Cardiac Monitor Leads', checked: false },
  ]);
  const [importStatus, setImportStatus] = React.useState<'idle' | 'uploading' | 'parsing' | 'done'>('idle');

  const handlePrint = () => {
    window.print();
  };

  const handleCrashCart = () => {
    setShowCrashCart(true);
  };

  const toggleCrashCartItem = (id: number) => {
    setCrashCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleBulkImport = () => {
    setShowBulkImport(true);
    setImportStatus('idle');
  };

  const processImport = () => {
    setImportStatus('uploading');
    setTimeout(() => {
      setImportStatus('parsing');
      setTimeout(() => {
        // Simulate data update
        setItems(prev => prev.map(item => ({
          ...item,
          stock: item.stock + Math.floor(Math.random() * 50)
        })));
        setImportStatus('done');
        setTimeout(() => setShowBulkImport(false), 2000);
      }, 1500);
    }, 1500);
  };

  const updateThreshold = (id: string, threshold: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newThreshold = Math.max(0, threshold);
        let newStatus: typeof item.status = 'In Stock';
        if (item.stock === 0) newStatus = 'Out of Stock';
        else if (item.stock < newThreshold) newStatus = 'Low Stock';
        
        return { ...item, lowStockThreshold: newThreshold, status: newStatus };
      }
      return item;
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    }, 1500);
  };

  const handleRestock = (itemId: string) => {
    const amount = 10;
    setItems(items.map(item => {
      if (item.id === itemId) {
        const newStock = item.stock + amount;
        const threshold = item.lowStockThreshold ?? 10;
        let newStatus: typeof item.status = 'In Stock';
        if (newStock === 0) newStatus = 'Out of Stock';
        else if (newStock < threshold) newStatus = 'Low Stock';

        return { ...item, stock: newStock, status: newStatus };
      }
      return item;
    }));
    
    setLastRestock({ id: itemId, amount });
    setShowSaveSuccess(true);
    // Success notice will auto-hide, but undo is available during that time
    setTimeout(() => {
      setShowSaveSuccess(false);
      setLastRestock(null);
    }, 5000);
  };

  const handleUndoRestock = () => {
    if (!lastRestock) return;
    
    setItems(items.map(item => {
      if (item.id === lastRestock.id) {
        const newStock = Math.max(0, item.stock - lastRestock.amount);
        const threshold = item.lowStockThreshold ?? 10;
        let newStatus: typeof item.status = 'In Stock';
        if (newStock === 0) newStatus = 'Out of Stock';
        else if (newStock < threshold) newStatus = 'Low Stock';
        
        return { ...item, stock: newStock, status: newStatus };
      }
      return item;
    }));
    
    setLastRestock(null);
    setShowSaveSuccess(false);
  };

  const filteredItems = items.filter(item => 
    (filter === 'All' || (filter === 'Emergency' ? item.id.startsWith('EMER') || item.id.startsWith('CART') : item.category === filter)) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Print Header (Only visible when printing) */}
      <div className="hidden print:block mb-8 text-center pb-8 border-b-2 border-slate-900">
        <h1 className="text-3xl font-black uppercase tracking-widest text-slate-900">CentiCare HIS</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-2">Official Inventory Audit Report</p>
        <div className="mt-6 grid grid-cols-3 gap-8 text-left">
          <div>
            <p className="text-[8px] font-black text-slate-400 uppercase">Generated By</p>
            <p className="text-xs font-bold text-slate-800">Admin Staff - Pharmacy Unit</p>
          </div>
          <div>
            <p className="text-[8px] font-black text-slate-400 uppercase">Timestamp</p>
            <p className="text-xs font-bold text-slate-800">{new Date().toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[8px] font-black text-slate-400 uppercase">Total Items</p>
            <p className="text-xs font-bold text-slate-800">{items.length} SKUs Listed</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest">Pharmacy & Inventory</h2>
            <span className="px-2 py-0.5 bg-red-500 text-white text-[8px] font-black rounded uppercase animate-pulse">Crash Cart Active</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">Track medical supplies, medications, and emergency equipment.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all font-sans print:hidden"
          >
            <Printer size={16} />
            Print Inventory
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-200 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            onClick={handleBulkImport}
            className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all"
          >
            <Plus size={16} />
            Bulk Import
          </button>
        </div>
      </div>

      <div className="mb-6 flex justify-end">
        <button 
          onClick={handleCrashCart}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:scale-[1.02] transition-all"
        >
          <AlertTriangle size={16} />
          CRASH CART CHECKLIST
        </button>
      </div>

      <AnimatePresence>
        {showSaveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-4 left-1/2 z-50 bg-slate-800 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 border border-slate-700"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <CheckCircle size={16} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest italic">Stock Registry Updated</span>
            </div>
            
            {lastRestock && (
              <button 
                onClick={handleUndoRestock}
                className="px-4 py-1.5 bg-brand text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-brand-light transition-all flex items-center gap-2"
              >
                <ArrowRightLeft size={12} className="rotate-180" />
                Undo Action
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Out of Stock', count: items.filter(i => i.status === 'Out of Stock').length, color: 'text-red-500', bg: 'bg-red-50', icon: AlertTriangle },
          { label: 'Low Stock', count: items.filter(i => i.status === 'Low Stock').length, color: 'text-amber-500', bg: 'bg-amber-50', icon: AlertTriangle },
          { label: 'Total Items', count: items.length, color: 'text-brand', bg: 'bg-brand-light/30', icon: Package },
        ].map((stat, i) => (
          <div key={i} className={cn("p-6 rounded-3xl border border-transparent shadow-sm flex items-center justify-between", stat.bg)}>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className={cn("text-3xl font-black", stat.color)}>{stat.count}</h3>
            </div>
            <div className={cn("p-4 rounded-2xl bg-white", stat.color)}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search inventory items..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand/10 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            {['All', 'Medicine', 'Supply', 'Equipment', 'Emergency'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  filter === f ? "bg-slate-800 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Information</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">In Stock</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Threshold</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {filteredItems.map((item, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={item.id} 
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{item.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">{item.id}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg uppercase tracking-widest">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-center">
                      <p className={cn(
                        "text-sm font-black text-slate-800"
                      )}>
                        {item.stock} {item.unit}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center">
                      <input 
                        type="number"
                        min="0"
                        value={item.lowStockThreshold ?? 10}
                        onChange={(e) => updateThreshold(item.id, parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-black text-center focus:ring-2 focus:ring-brand outline-none"
                      />
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs text-slate-600 font-mono italic text-center">
                      {item.expiryDate || 'N/A'}
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0 w-fit",
                      item.status === 'In Stock' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      item.status === 'Low Stock' ? "bg-amber-50 text-amber-600 border-amber-100" :
                      "bg-red-50 text-red-600 border-red-100 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                    )}>
                      {item.status === 'In Stock' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-brand hover:bg-brand-light/30 rounded-lg transition-all">
                        <ArrowRightLeft size={16} />
                      </button>
                      <button 
                        onClick={() => handleRestock(item.id)}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-800/10 hover:scale-[1.05] transition-all"
                      >
                        Restock
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredItems.length === 0 && (
            <div className="p-20 text-center">
              <Package size={48} className="text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest">No matching inventory items</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Crash Cart Checklist Modal */}
      <AnimatePresence>
        {showCrashCart && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCrashCart(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col border border-slate-100"
            >
              <div className="p-8 bg-red-600 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-widest">Crash Cart Checklist</h3>
                    <p className="text-[10px] font-black text-red-200 uppercase tracking-[0.2em]">Standard Emergency Protocol v3.0</p>
                  </div>
                </div>
                <button onClick={() => setShowCrashCart(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-10 space-y-4">
                <div className="bg-red-50 p-4 rounded-2xl mb-4 border border-red-100">
                  <p className="text-[10px] font-black text-red-800 uppercase leading-relaxed text-center">
                    Warning: This checklist must be completed every shift or after every emergency use. Ensure all items are present and within expiry.
                  </p>
                </div>
                
                <div className="space-y-2 overflow-y-auto max-h-[40vh] pr-2">
                  {crashCartItems.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => toggleCrashCartItem(item.id)}
                      className={cn(
                        "w-full p-4 rounded-2xl border transition-all flex items-center justify-between group",
                        item.checked 
                          ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                          : "bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300"
                      )}
                    >
                      <span className="text-xs font-bold uppercase tracking-wide text-left">{item.label}</span>
                      <div className={cn(
                        "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0",
                        item.checked ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-white"
                      )}>
                        {item.checked && <CheckCircle size={14} />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => setShowCrashCart(false)}
                    disabled={!crashCartItems.every(i => i.checked)}
                    className={cn(
                      "w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl",
                      crashCartItems.every(i => i.checked)
                        ? "bg-slate-800 text-white hover:bg-slate-700 shadow-slate-200"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    Submit Verified Checklist
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Import Modal */}
      <AnimatePresence>
        {showBulkImport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBulkImport(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col border border-slate-100"
            >
              <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand rounded-2xl">
                    <Upload size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-widest">Inventory Bulk Import</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">CentiCare Data Management System</p>
                  </div>
                </div>
                <button onClick={() => setShowBulkImport(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-10 space-y-8">
                {importStatus === 'idle' ? (
                  <>
                    <div className="p-12 border-2 border-dashed border-slate-200 rounded-[2rem] text-center hover:border-brand/50 transition-all cursor-pointer group">
                      <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-brand/10 group-hover:text-brand transition-all">
                        <FileText size={32} />
                      </div>
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">Drop Inventory Manifest</h4>
                      <p className="text-xs text-slate-500 font-medium">Supports .csv, .xlsx, or .json templates</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-4">
                      <Download size={20} className="text-blue-500 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Template Download</p>
                        <p className="text-[9px] text-blue-600 font-medium mt-1 underline cursor-pointer">Download CentiCare Inventory Master Template (2026 v2.0)</p>
                      </div>
                    </div>

                    <button 
                      onClick={processImport}
                      className="w-full py-4 bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-xl shadow-slate-200"
                    >
                      Process Selected Files
                    </button>
                  </>
                ) : importStatus === 'uploading' ? (
                  <div className="text-center py-10 space-y-6">
                    <div className="w-16 h-16 border-4 border-slate-100 border-t-brand rounded-full animate-spin mx-auto"></div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Uploading Master Files...</h4>
                      <p className="text-xs text-slate-500 font-medium mt-1 italic">Verifying checksums and digital signatures...</p>
                    </div>
                  </div>
                ) : importStatus === 'parsing' ? (
                  <div className="text-center py-10 space-y-6">
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.5 }}
                        className="h-full bg-brand"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Parsing Spreadsheet Data...</h4>
                      <p className="text-xs text-slate-500 font-medium mt-1">Cross-referencing SKU IDs with DOH Master Registry</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-6">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={48} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-emerald-800 uppercase tracking-widest">Import Successful</h4>
                      <p className="text-xs text-emerald-600 font-medium mt-1">42 Inventory Records Synchronized</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
