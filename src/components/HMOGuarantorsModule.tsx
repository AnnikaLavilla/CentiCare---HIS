/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, ShieldCheck, Building2, CreditCard, ChevronRight, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

// Mock HMO Data
const HMOS = [
  { id: 'HMO-001', name: 'Maxicare Health', category: 'Major', status: 'Active', patients: 124 },
  { id: 'HMO-002', name: 'Intellicare', category: 'Major', status: 'Active', patients: 89 },
  { id: 'HMO-003', name: 'PhilHealth', category: 'Government', status: 'Active', patients: 452 },
  { id: 'HMO-004', name: 'MediCard', category: 'Major', status: 'Active', patients: 67 },
  { id: 'HMO-005', name: 'Cocolife Disability', category: 'Corporate', status: 'Active', patients: 31 },
  { id: 'HMO-006', name: 'Caritas Health', category: 'Local', status: 'Active', patients: 15 },
];

export const HMOGuarantorsModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filtered = HMOS.filter(hmo => 
    hmo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    hmo.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <ShieldCheck className="text-emerald-600" />
            HMO & Guarantors
          </h2>
          <p className="text-slate-500">Registry and billing status of accredited health insurance providers.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search partner ID/name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand outline-none w-64 shadow-sm bg-white"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 shadow-sm transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((hmo, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={hmo.id}
            className="group bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-brand-light text-brand rounded-2xl group-hover:bg-brand group-hover:text-white transition-all duration-300 shadow-sm">
                  <Building2 size={24} />
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  hmo.status === 'Active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                )}>
                  {hmo.status}
                </div>
              </div>
              
              <h3 className="text-xl font-black text-slate-800 mb-1 tracking-tight">
                {hmo.name}
              </h3>
              <p className="text-xs font-bold text-brand uppercase tracking-widest mb-6 opacity-60">{hmo.category} Provider</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Guarantor ID</p>
                  <p className="text-sm font-black text-slate-700">{hmo.id}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Active Patients</p>
                  <p className="text-sm font-black text-brand">{hmo.patients}</p>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-brand text-white rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95">
                <CreditCard size={16} />
                BILLING SETTINGS
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 bg-brand-sidebar rounded-[2rem] p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
          <ShieldCheck size={160} className="text-emerald-400" />
        </div>
        
        <div className="max-w-xl relative transform transition-transform hover:scale-[1.02] duration-500 cursor-default">
          <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Need to register a new Guarantor?</h3>
          <p className="text-emerald-100/60 mb-8 font-medium leading-relaxed"> Add new partner HMOs, corporate clients, or government agencies to our billing system. Ensure all accreditation documents are uploaded for seamless processing.</p>
          <button className="px-8 py-3.5 bg-brand text-white rounded-2xl font-black tracking-wide hover:bg-emerald-500 transition-all shadow-xl shadow-brand/20 active:scale-95">
            + ACCREDIT NEW PARTNER
          </button>
        </div>
      </div>
    </div>
  );
};
