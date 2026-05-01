import React from 'react';
import { Search, Package, AlertTriangle, CheckCircle, ArrowRightLeft, Plus } from 'lucide-react';
import { InventoryItem } from '../types';
import { INVENTORY_ITEMS } from '../constants';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export const InventoryModule: React.FC = () => {
  const [items] = React.useState<InventoryItem[]>(INVENTORY_ITEMS);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filter, setFilter] = React.useState<'All' | 'Medicine' | 'Supply' | 'Equipment' | 'Emergency'>('All');

  const filteredItems = items.filter(item => 
    (filter === 'All' || (filter === 'Emergency' ? item.id.startsWith('EMER') || item.id.startsWith('CART') : item.category === filter)) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest">Pharmacy & Inventory</h2>
            <span className="px-2 py-0.5 bg-red-500 text-white text-[8px] font-black rounded uppercase animate-pulse">Crash Cart Active</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">Track medical supplies, medications, and emergency equipment.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:scale-[1.02] transition-all">
            <AlertTriangle size={16} />
            CRASH CART CHECKLIST
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all">
            <Plus size={16} />
            Bulk Import
          </button>
        </div>
      </div>

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
                        "text-sm font-black",
                        item.stock === 0 ? "text-red-500" : item.stock < 50 ? "text-amber-500" : "text-slate-800"
                      )}>
                        {item.stock} {item.unit}
                      </p>
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-2 mx-auto overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all",
                            item.stock === 0 ? "bg-red-500 w-0" : item.stock < 50 ? "bg-amber-500 w-1/3" : "bg-emerald-500 w-full"
                          )}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs text-slate-600 font-mono italic">
                      {item.expiryDate || 'N/A (Non-Perishable)'}
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
                      <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-800/10 hover:scale-[1.05] transition-all">
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
    </div>
  );
};
