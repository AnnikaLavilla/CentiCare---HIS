import React from 'react';
import { Clock, CheckCircle, AlertOctagon, User, MoreVertical, Search, BellRing, Filter } from 'lucide-react';
import { KardexTask } from '../types';
import { KARDEX_TASKS } from '../constants';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const NursingKardexModule: React.FC = () => {
  const [tasks, setTasks] = React.useState<KardexTask[]>(KARDEX_TASKS);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filter, setFilter] = React.useState<'All' | 'Pending' | 'Completed' | 'Missed'>('All');

  const filteredTasks = tasks.filter(task => 
    (filter === 'All' || task.status === filter) &&
    (task.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || task.task.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { 
          ...t, 
          status: t.status === 'Completed' ? 'Pending' : 'Completed' 
        };
      }
      return t;
    }));
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-brand p-3 rounded-2xl shadow-lg shadow-brand/20">
            <BellRing className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest">Nursing Kardex</h2>
            <p className="text-sm text-slate-500 font-medium">Shift Task Management & Clinical Surveillance</p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button className="px-6 py-2 bg-white text-slate-800 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm">Current Shift</button>
          <button className="px-6 py-2 text-slate-400 font-black text-xs uppercase tracking-widest">Shift Logs</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search patient or task..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <div className="flex gap-2">
                {['All', 'Pending', 'Completed', 'Missed'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border",
                      filter === f ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-400 border-slate-200 hover:text-slate-600"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task, i) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  key={task.id}
                  className={cn(
                    "relative p-6 rounded-3xl border transition-all cursor-pointer group",
                    task.status === 'Completed' ? "bg-slate-50 border-emerald-100 opacity-75" : "bg-white border-slate-200 hover:shadow-xl hover:shadow-slate-200/50"
                  )}
                  onClick={() => toggleStatus(task.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn(
                      "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5",
                      task.priority === 'High' ? "bg-red-50 text-red-600 border border-red-100" :
                      task.priority === 'Stat' ? "bg-slate-900 text-white animate-pulse" :
                      "bg-blue-50 text-blue-600 border border-blue-100"
                    )}>
                      {task.priority === 'Stat' && <AlertOctagon size={10} />}
                      {task.priority} Priority
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-mono font-bold">
                      <Clock size={14} />
                      {task.timeDue}
                    </div>
                  </div>

                  <h3 className={cn(
                    "text-lg font-black uppercase tracking-tight mb-2 flex items-center gap-2",
                    task.status === 'Completed' ? "text-slate-400 line-through" : "text-slate-800"
                  )}>
                    {task.task}
                    {task.status === 'Completed' && <CheckCircle size={18} className="text-emerald-500 shrink-0" />}
                  </h3>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Patient</p>
                      <p className="text-xs font-bold text-slate-700">{task.patientName} <span className="text-slate-400">({task.patientId})</span></p>
                    </div>
                  </div>

                  <div className="absolute right-6 bottom-6 group-hover:translate-x-1 transition-all text-slate-300">
                    <MoreVertical size={20} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <h4 className="text-[10px] font-black text-brand-light uppercase tracking-[0.3em] mb-4">Patient Surveillance</h4>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">High Risk Patients</span>
                <span className="text-xl font-bold text-red-400">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Pending STAT Meds</span>
                <span className="text-xl font-bold text-amber-400">1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Next Vitals Round</span>
                <span className="text-xs font-mono font-bold text-emerald-400">11:00 AM</span>
              </div>
              <div className="pt-6 border-t border-white/10">
                <button className="w-full py-4 bg-brand rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/20 hover:scale-[1.02] transition-all">
                  Generate End-of-Shift Report
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Recent Alerts</h4>
            <div className="space-y-4">
              {[
                { time: '10m ago', text: 'Room 402 - Stat refer to doctor', type: 'error' },
                { time: '25m ago', text: 'Room 311 - MGH Notice issued', type: 'success' },
                { time: '1h ago', text: 'Pharmacy - Paracetamol Restocked', type: 'info' },
              ].map((alert, i) => (
                <div key={i} className="flex gap-3">
                  <div className={cn(
                    "w-1.5 h-10 rounded-full",
                    alert.type === 'error' ? 'bg-red-500' : alert.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                  )}></div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{alert.text}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
