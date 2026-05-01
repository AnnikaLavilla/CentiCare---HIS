/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Filter, MoreVertical, ExternalLink } from 'lucide-react';
import { Patient } from '../types';
import { cn } from '../lib/utils';

interface PatientMasterListProps {
  patients: Patient[];
  onOpenPatient?: (id: string) => void;
}

export const PatientMasterList: React.FC<PatientMasterListProps> = ({ patients, onOpenPatient }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Patient Master List</h2>
          <p className="text-slate-500">Centralized database of all registered patients.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand outline-none w-64 shadow-sm bg-white"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase text-slate-400 font-bold tracking-wider border-b border-slate-100">
              <th className="px-6 py-4">Patient Name</th>
              <th className="px-6 py-4">ID Number</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Admission Date</th>
              <th className="px-6 py-4">Discharge</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-slate-800">{patient.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600 font-mono">{patient.id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[11px] font-bold uppercase",
                    patient.status === 'Inpatient' ? "bg-brand-light text-brand" :
                    patient.status === 'Emergency' ? "bg-red-100 text-red-700" :
                    "bg-slate-100 text-slate-700"
                  )}>
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {patient.admission}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {patient.discharge}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => onOpenPatient?.(patient.id)}
                      className="p-1.5 text-brand hover:bg-brand-light rounded transition-colors"
                      title="View Medical Chart"
                    >
                      <ExternalLink size={18} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPatients.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 text-lg">No patients found matches your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};
