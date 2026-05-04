/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Bell, User, Settings, LogOut, HelpCircle, LifeBuoy, X, BookOpen, ExternalLink, FileText } from 'lucide-react';
import { User as UserType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface TopBarProps {
  onLogout: () => void;
  onOpenAccount: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onLogout, onOpenAccount }) => {
  const user: UserType | null = JSON.parse(localStorage.getItem('user') || 'null');
  const [showHowDoI, setShowHowDoI] = React.useState(false);
  const [showSupport, setShowSupport] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const notifications = [
    { id: 1, title: 'STAT ORDER', message: 'Room 402 - Epinephrine 1mg', time: '2m ago', type: 'urgent' },
    { id: 2, title: 'LOW STOCK', message: 'Adenosine vials below threshold', time: '15m ago', type: 'warning' },
    { id: 3, title: 'MGH UPDATE', message: 'Patient #29381 cleared by Social Service', time: '1h ago', type: 'info' }
  ];

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <img 
              src="/centicare-logo.png" 
              alt="CentiCare Logo" 
              className="w-10 h-10 object-contain z-10 relative"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand/20">
              C
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight leading-none">CentiCare HIS</h1>
            <p className="text-[10px] font-bold text-brand tracking-[0.2em] mt-0.5 uppercase">Care That Cures</p>
          </div>
        </div>

        <div className="flex items-center gap-6 ml-10 border-l border-slate-200 pl-10 hidden lg:flex">
          <button 
            onClick={() => setShowHowDoI(true)}
            className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-brand transition-colors group"
          >
            <HelpCircle size={16} className="group-hover:scale-110 transition-transform" />
            <span>HOW DO I?</span>
          </button>
          <button 
            onClick={() => setShowSupport(true)}
            className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-brand transition-colors group"
          >
            <LifeBuoy size={16} className="group-hover:scale-110 transition-transform" />
            <span>TECHNICAL SUPPORT</span>
          </button>
        </div>
        
        <div className="ml-12 relative hidden xl:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search resources, patients..." 
            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full w-80 text-sm focus:ring-2 focus:ring-brand outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-slate-500 hover:text-brand relative p-2 rounded-full hover:bg-slate-50 transition-all"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
                >
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Notifications</h4>
                    <span className="text-[8px] font-black bg-brand/10 text-brand px-2 py-0.5 rounded-full uppercase">3 New</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-1">
                          <span className={cn(
                            "text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter",
                            n.type === 'urgent' ? "bg-red-500 text-white animate-pulse" :
                            n.type === 'warning' ? "bg-amber-500 text-white" : "bg-blue-500 text-white"
                          )}>
                            {n.title}
                          </span>
                          <span className="text-[8px] font-bold text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium group-hover:text-brand transition-colors">{n.message}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full p-3 text-[10px] font-black text-slate-400 hover:text-brand transition-colors uppercase tracking-widest bg-slate-50/50">
                    Clear All Notifications
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        
        <button 
          onClick={onOpenAccount}
          className="text-slate-500 hover:text-brand p-2 rounded-full hover:bg-slate-50 transition-all"
        >
          <Settings size={20} />
        </button>
        <div className="h-8 w-px bg-slate-200"></div>
        <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1 px-2 rounded-lg transition-colors group relative" onClick={onOpenAccount}>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800 leading-tight uppercase tracking-tight">{user?.username || 'Guest'}</p>
            <p className="text-[10px] font-black text-brand leading-none uppercase tracking-widest">{user?.role || 'Guest'}</p>
          </div>
          <div className="w-9 h-9 bg-brand-light rounded-full overflow-hidden flex items-center justify-center text-brand font-black border-2 border-white shadow-sm ring-2 ring-brand/10 group-hover:ring-brand transition-all">
            {(user?.username?.[0] || 'G').toUpperCase()}
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-2"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* How Do I Modal */}
      <AnimatePresence>
        {showHowDoI && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHowDoI(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-xl rounded-3xl shadow-2xl relative overflow-hidden flex flex-col"
            >
              <div className="p-6 bg-brand flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                  <BookOpen size={24} />
                  <h3 className="text-xl font-black uppercase tracking-widest">Knowledge Base</h3>
                </div>
                <button onClick={() => setShowHowDoI(false)}><X size={24} /></button>
              </div>
              <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                {[
                  { q: "How to tag MGH?", a: "Go to Patient Chart > Clinical Flow > Update Status toggle to MGH. This triggers social service and billing clearance automatically." },
                  { q: "Respond to Stat Orders?", a: "Stat orders appear in the Nursing Kardex with red highlights. Acknowledge and document administration time within 15 minutes." },
                  { q: "Inventory Restock?", a: "Navigate to Pharmacy module. Low stock items are highlighted in amber. Click 'Restock' to generate a pharmacy requisition form." },
                  { q: "Downtime Procedure?", a: "In case of system outage, use pre-printed Charting Forms. Sync all data manually once HIS Core is back online." }
                ].map((item, i) => (
                  <div key={i} className="group cursor-help">
                    <p className="text-xs font-black text-brand uppercase tracking-widest mb-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brand rounded-full"></span>
                      {item.q}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed pl-3.5 border-l border-slate-100 group-hover:border-brand transition-colors">{item.a}</p>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
                <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-brand transition-colors uppercase tracking-widest">
                  <ExternalLink size={14} />
                  View Full Clinical Manual
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Support Modal */}
      <AnimatePresence>
        {showSupport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSupport(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative overflow-hidden"
            >
              <div className="p-6 bg-slate-800 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <LifeBuoy size={24} />
                  <h3 className="text-xl font-black uppercase tracking-widest">IT Helpdesk</h3>
                </div>
                <button onClick={() => setShowSupport(false)}><X size={24} /></button>
              </div>
              <div className="p-8 text-center space-y-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">System Version</p>
                  <p className="text-lg font-black text-slate-800">HIS Core v2.4(Enterprise)</p>
                  <p className="text-[10px] font-bold text-emerald-500 mt-2 flex items-center justify-center gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    ALL SYSTEMS OPERATIONAL
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-slate-500">Internal Extension:</span>
                    <span className="font-bold text-slate-800">#IT-911</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-slate-500">Local ID:</span>
                    <span className="font-mono text-slate-800 uppercase">WARD-4A-TERM02</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-slate-500">Support Email:</span>
                    <span className="text-brand font-bold">it-support@hospital.com</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="w-full py-4 bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-800/20 hover:scale-[1.02] transition-all">
                    Initiate Remote Support Session
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
