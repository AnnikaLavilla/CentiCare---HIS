import React from 'react';
import { Bed, Users, Filter, Maximize2, Activity, ShieldAlert, MonitorPlay, Plus } from 'lucide-react';
import { Patient } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface WardViewModuleProps {
  patients: Patient[];
  onOpenPatient: (id: string) => void;
}

export const WardViewModule: React.FC<WardViewModuleProps> = ({ patients, onOpenPatient }) => {
  const [selectedWard, setSelectedWard] = React.useState('All');
  
  const wards = ['Maternity', 'Cardiology', 'Pediatrics', 'Internal Medicine', 'Emergency'];
  const filteredPatients = selectedWard === 'All' 
    ? patients 
    : patients.filter(p => p.ward === selectedWard);

  // Mock bed distribution
  const gridBeds = Array.from({ length: 24 }, (_, i) => {
    const bedNumber = 401 + i;
    const patient = filteredPatients.find((_, index) => index === i % filteredPatients.length); // Mock mapping
    return { bedNumber, patient };
  });

  return (
    <div className="p-8 h-full flex flex-col overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shrink-0">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest">Interactive Ward Map</h2>
          <p className="text-sm text-slate-500 font-medium">Real-time bed occupancy and clinical surveillance dashboard.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setSelectedWard('All')}
              className={cn(
                "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                selectedWard === 'All' ? "bg-white text-brand shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              All Wards
            </button>
            {wards.map(ward => (
              <button
                key={ward}
                onClick={() => setSelectedWard(ward)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  selectedWard === ward ? "bg-white text-brand shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {ward}
              </button>
            ))}
          </div>
          <button className="p-3 bg-slate-800 text-white rounded-xl shadow-lg hover:scale-105 transition-all">
            <MonitorPlay size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 pb-12">
          {gridBeds.map((bed, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              key={i}
              className={cn(
                "relative h-48 rounded-3xl border-2 transition-all group overflow-hidden flex flex-col",
                bed.patient 
                  ? "bg-white border-brand-light shadow-sm hover:shadow-xl hover:border-brand cursor-pointer" 
                  : "bg-slate-50 border-slate-100 border-dashed"
              )}
              onClick={() => bed.patient && onOpenPatient(bed.patient.id)}
            >
              <div className="p-4 flex items-center justify-between border-b border-transparent group-hover:border-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-1.5 rounded-lg",
                    bed.patient ? "bg-brand/10 text-brand" : "bg-slate-200 text-slate-400"
                  )}>
                    <Bed size={16} />
                  </div>
                  <span className="text-xs font-black text-slate-400 tracking-widest">BED {bed.bedNumber}</span>
                </div>
                {bed.patient && (
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    bed.patient.clinicalStatus === 'Active' ? 'bg-blue-500 animate-pulse' :
                    bed.patient.clinicalStatus === 'MGH' ? 'bg-emerald-500' :
                    'bg-slate-300'
                  )}></span>
                )}
              </div>

              <div className="flex-1 p-4 flex flex-col justify-center">
                {bed.patient ? (
                  <>
                    <h3 className="text-xs font-black text-slate-800 uppercase leading-tight mb-1 truncate">
                      {bed.patient.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase truncate">{bed.patient.diagnosis}</p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex -space-x-1.5">
                        <div className="w-5 h-5 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center">
                          <Activity size={10} className="text-slate-400" />
                        </div>
                        <div className="w-5 h-5 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center">
                          <Users size={10} className="text-slate-400" />
                        </div>
                      </div>
                      <div className="px-2 py-0.5 bg-brand-light text-brand text-[8px] font-black rounded uppercase tracking-widest">
                        {bed.patient.clinicalStatus}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-300">
                    <p className="text-[10px] font-black uppercase tracking-widest">Available</p>
                    <Plus size={16} className="mt-1" />
                  </div>
                )}
              </div>

              {bed.patient?.clinicalStatus === 'Active' && bed.patient.id === 'PT-001001' && (
                <div className="absolute top-0 right-0 p-3">
                  <ShieldAlert className="text-red-500" size={16} />
                </div>
              )}
              
              {bed.patient && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "70%" }}
                    className="h-full bg-brand"
                  ></motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="shrink-0 p-6 bg-slate-50 border-t border-slate-200 mt-4 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-brand rounded shadow-sm"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Occupied ({filteredPatients.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-200 rounded border border-transparent border-dashed"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Available ({24 - filteredPatients.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-red-500 rounded ring-4 ring-red-100"></div>
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Critical Alert</span>
          </div>
        </div>
        <button className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-brand transition-all uppercase tracking-widest">
          <Maximize2 size={16} />
          Full Screen Map
        </button>
      </div>
    </div>
  );
};
