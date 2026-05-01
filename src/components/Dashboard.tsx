/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, Bed, Activity, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { Patient } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface DashboardProps {
  patients: Patient[];
}

export const Dashboard: React.FC<DashboardProps> = ({ patients }) => {
  const stats = [
    { label: 'Total Patients', value: patients.length, bgColor: 'bg-brand-light', textColor: 'text-brand', icon: Users },
    { label: 'Admitted', value: patients.filter(p => p.status === 'Inpatient').length, bgColor: 'bg-emerald-50', textColor: 'text-emerald-600', icon: Bed },
    { label: 'Emergency', value: patients.filter(p => p.status === 'Emergency').length, bgColor: 'bg-amber-50', textColor: 'text-amber-600', icon: Activity },
    { label: 'Outpatient', value: patients.filter(p => p.status === 'Outpatient').length, bgColor: 'bg-purple-50', textColor: 'text-purple-600', icon: Clock },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Health Overview</h2>
        <p className="text-slate-500">Real-time statistics for CentiCare Health Information System.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-default group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-xl group-hover:scale-110 transition-transform", stat.bgColor, stat.textColor)}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp size={12} className="mr-1" />
                +12%
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Active Admissions</h3>
            <button className="text-brand text-sm font-medium hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase text-slate-400 font-semibold border-b border-slate-100">
                  <th className="pb-4 pt-0">Patient</th>
                  <th className="pb-4 pt-0">Ward</th>
                  <th className="pb-4 pt-0">Admission Date</th>
                  <th className="pb-4 pt-0">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.filter(p => p.status === 'Inpatient').map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{patient.name}</p>
                          <p className="text-xs text-slate-500">{patient.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-600 font-medium">{patient.ward}</td>
                    <td className="py-4 text-sm text-slate-600">{patient.admission}</td>
                    <td className="py-4">
                      <span className={cn(
                        "px-2 py-0.5 text-[9px] font-black rounded-full uppercase tracking-widest border shrink-0 inline-block",
                        patient.clinicalStatus === 'Active' ? "bg-blue-50 text-blue-600 border-blue-100 shadow-[0_0_10px_rgba(59,130,246,0.1)]" :
                        patient.clinicalStatus === 'MGH' ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_0_10px_rgba(16,185,129,0.1)]" :
                        patient.clinicalStatus === 'Cleared' ? "bg-violet-50 text-violet-600 border-violet-100 shadow-[0_0_10px_rgba(139,92,246,0.1)]" :
                        patient.clinicalStatus === 'Expired' ? "bg-slate-50 text-slate-500 border-slate-100" :
                        "bg-amber-50 text-amber-600 border-amber-100"
                      )}>
                        {patient.clinicalStatus || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Recent Alerts</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-orange-50 border border-orange-100">
                <AlertCircle className="text-orange-500 shrink-0" size={20} />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Critical Medication Reorder</p>
                  <p className="text-xs text-slate-600 mt-1">Oxytocin stock in Pharmacy Ward A is running low.</p>
                  <p className="text-[10px] text-slate-400 mt-2">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
