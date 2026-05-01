/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Flame, ChevronRight, Lock, AlertCircle } from 'lucide-react';
import { Patient } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface EmergencyModuleProps {
  patients: Patient[];
  onOpenPatient: (id: string) => void;
}

export const EmergencyModule: React.FC<EmergencyModuleProps> = ({ patients, onOpenPatient }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const emergencyPatients = patients.filter(p => p.status === 'Emergency');

  const filtered = emergencyPatients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <AlertCircle className="text-red-500" />
            Emergency Department
          </h2>
          <p className="text-slate-500">Active ER cases and critical monitoring.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search ER patient/ID..." 
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
            className="group bg-white rounded-2xl border-l-4 border-l-red-500 border-y border-r border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => onOpenPatient(patient.id)}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-red-50 text-red-500 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <AlertCircle size={24} />
                </div>
                <div className="flex flex-col items-end gap-2">
                  {patient.locked && <Lock size={16} className="text-slate-400" />}
                  <span className={cn(
                    "px-2 py-0.5 text-[8px] font-black rounded-full uppercase tracking-widest border",
                    patient.clinicalStatus === 'Active' ? "bg-blue-50 text-blue-600 border-blue-100" :
                    patient.clinicalStatus === 'MGH' ? "bg-emerald-50 text-emerald-600 border-emerald-100 font-black" :
                    patient.clinicalStatus === 'Cleared' ? "bg-violet-50 text-violet-600 border-violet-100" :
                    patient.clinicalStatus === 'Expired' ? "bg-slate-50 text-slate-500 border-slate-100" :
                    "bg-amber-50 text-amber-600 border-amber-100"
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
                  <span className="text-slate-400">Diagnosis</span>
                  <span className="font-semibold text-red-600 truncate max-w-[150px]">{patient.diagnosis}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">ER Area</span>
                  <span className="font-semibold text-slate-700">{patient.ward}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Time Arrival</span>
                  <span className="font-semibold text-slate-700">{patient.admission}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-brand">OPEN ER CHART</span>
                <ChevronRight size={16} className="text-brand transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <AlertCircle className="mx-auto text-slate-200 mb-4" size={48} />
          <p className="text-slate-400">Zero active ER cases. Good work team.</p>
        </div>
      )}
    </div>
  );
};
