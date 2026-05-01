/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Activity, 
  UserPlus, 
  Bed, 
  LogOut, 
  User,
  Menu,
  X,
  ClipboardList,
  Map,
  Pill
} from 'lucide-react';
import { TabType } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Overview' },
    { id: 'kardex', label: 'Nursing Kardex', icon: ClipboardList, section: 'Overview' },
    { id: 'wardView', label: 'Interactive Ward', icon: Map, section: 'Overview' },
    { id: 'patients', label: 'Patients', icon: Users, section: 'Master Files' },
    { id: 'hmo', label: 'HMO / Guarantors', icon: ShieldCheck, section: 'Master Files' },
    { id: 'pharmacy', label: 'Pharmacy/Inventory', icon: Pill, section: 'Master Files' },
    { id: 'account', label: 'My Account', icon: User, section: 'Master Files' },
    { id: 'emergency', label: 'Emergency', icon: Activity, section: 'Transactions' },
    { id: 'outpatient', label: 'Outpatient', icon: UserPlus, section: 'Transactions' },
    { id: 'inpatient', label: 'Inpatient', icon: Bed, section: 'Transactions' },
  ];

  const sections = ['Overview', 'Master Files', 'Transactions'];

  return (
    <div className={cn(
      "bg-brand-sidebar text-slate-400 h-screen transition-all duration-300 flex flex-col border-r border-brand-hover/30",
      isOpen ? "w-64" : "w-20"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-brand-hover/30">
        {isOpen && <h3 className="font-bold text-emerald-100 uppercase tracking-wider text-xs">Main Explorer</h3>}
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-brand rounded-md text-emerald-100/50 hover:text-emerald-50 transition-colors">
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {sections.map(section => (
          <div key={section} className="mb-6">
            {isOpen && <p className="px-6 text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest mb-3">{section}</p>}
            <ul>
              {menuItems.filter(item => item.icon && item.section === section).map(item => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id as TabType)}
                      className={cn(
                        "w-full flex items-center px-6 py-3.5 transition-all text-sm",
                        activeTab === item.id 
                          ? "bg-brand text-white border-r-4 border-emerald-400 shadow-lg shadow-brand/50" 
                          : "hover:bg-brand/40 hover:text-emerald-50"
                      )}
                    >
                      <Icon size={18} className={cn(isOpen ? "mr-4" : "mx-auto")} />
                      {isOpen && <span className="font-semibold">{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-brand-hover/30">
        <button 
          onClick={onLogout}
          className="w-full flex items-center px-4 py-3 hover:bg-red-500/10 rounded-xl transition-colors text-slate-500 hover:text-red-400 group"
        >
          <LogOut size={18} className={cn(isOpen ? "mr-4" : "mx-auto", "group-hover:rotate-12 transition-transform")} />
          {isOpen && <span className="text-sm font-bold">Log out</span>}
        </button>
      </div>
    </div>
  );
};
