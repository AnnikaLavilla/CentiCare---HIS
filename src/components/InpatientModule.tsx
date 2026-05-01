/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Bed, ChevronRight, Lock } from 'lucide-react';
import { Patient } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface InpatientModuleProps {
  patients: Patient[];
  onOpenPatient: (id: string) => void;
}

export const InpatientModule: React.FC<InpatientModuleProps> = ({ patients, onOpenPatient }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const inpatients = patients.filter(p => p.status === 'Inpatient');

  const filtered = inpatients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Active': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'MGH': return 'bg-emerald-50 text-emerald-600 border-emerald-100 font-black';
      case 'Cleared': return 'bg-violet-50 text-violet-600 border-violet-100';
      case 'Expired': return 'bg-slate-50 text-slate-500 border-slate-100';
      case 'Discharged': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Inpatient Monitoring</h2>
          <p className="text-slate-500">Real-time status of all currently admitted patients.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search inpatient room/ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand outline-none w-64 shadow-sm bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((patient, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            key={patient.id}
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col relative"
            onClick={() => onOpenPatient(patient.id)}
          >
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-brand-light text-brand rounded-xl group-hover:bg-brand group-hover:text-white transition-colors">
                  <Bed size={24} />
                </div>
                <div className="flex flex-col items-end gap-2">
                  {patient.locked && <Lock size={16} className="text-slate-400" />}
                  <span className={cn(
                    "px-2 py-0.5 text-[8px] font-black rounded-full uppercase tracking-widest border",
                    getStatusColor(patient.clinicalStatus)
                  )}>
                    {patient.clinicalStatus || 'Active'}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-brand transition-colors uppercase">
                {patient.name}
              </h3>
              <p className="text-xs font-mono text-slate-400 mb-4">{patient.id}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Ward</span>
                  <span className="font-semibold text-slate-700">{patient.ward}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Admission</span>
                  <span className="font-semibold text-slate-700">{patient.admission}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-brand">VIEW CHART</span>
                <ChevronRight size={16} className="text-brand transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <Bed className="mx-auto text-slate-200 mb-4" size={48} />
          <p className="text-slate-400">No inpatients matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
