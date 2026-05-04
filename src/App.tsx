/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  Activity, 
  Download, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { PatientMasterList } from './components/PatientMasterList';
import { InpatientModule } from './components/InpatientModule';
import { EmergencyModule } from './components/EmergencyModule';
import { OutpatientModule } from './components/OutpatientModule';
import { HMOGuarantorsModule } from './components/HMOGuarantorsModule';
import { NursingKardexModule } from './components/NursingKardexModule';
import { WardViewModule } from './components/WardViewModule';
import { InventoryModule } from './components/InventoryModule';
import { AccountModule } from './components/AccountModule';
import { PatientChart } from './components/PatientChart';
import { AddPatientModal } from './components/AddPatientModal';
import { DoctorMessagingModule } from './components/DoctorMessagingModule';
import { LoginPage } from './components/LoginPage';
import { Patient, TabType, User } from './types';
import { INITIAL_PATIENTS } from './constants';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from './lib/utils';

export default function App() {
  const [user, setUser] = React.useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = React.useState<TabType>('dashboard');
  const [patients, setPatients] = React.useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = React.useState<string | null>(null);
  const [showAddPatient, setShowAddPatient] = React.useState(false);
  const [showCensusReport, setShowCensusReport] = React.useState(false);
  const [isGeneratingCensus, setIsGeneratingCensus] = React.useState(false);

  const handleGenerateCensus = () => {
    setIsGeneratingCensus(true);
    setTimeout(() => {
      setIsGeneratingCensus(false);
      setShowCensusReport(true);
    }, 1500);
  };

  const selectedPatient = React.useMemo(() => 
    patients.find(p => p.id === selectedPatientId), 
    [patients, selectedPatientId]
  );

  const handleUpdatePatientRecord = (patientId: string, record: Patient['medicalRecord']) => {
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, medicalRecord: record } : p));
  };

  const handleCreatePatient = (newPatient: Patient) => {
    setPatients(prev => [...prev, newPatient]);
    setShowAddPatient(false);
  };

  const handleLogin = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleOpenPatient = (id: string) => {
    setSelectedPatientId(id);
  };

  const handleCloseChart = () => {
    setSelectedPatientId(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-light selection:text-brand">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar 
          onLogout={handleLogout} 
          onOpenAccount={() => setActiveTab('account')}
        />
        
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="pb-20"
              >
                {activeTab === 'dashboard' && <Dashboard patients={patients} />}
                {activeTab === 'patients' && (
                  <PatientMasterList 
                    patients={patients} 
                    onOpenPatient={handleOpenPatient} 
                    onAddPatient={() => setShowAddPatient(true)}
                  />
                )}
                {activeTab === 'inpatient' && <InpatientModule patients={patients} onOpenPatient={handleOpenPatient} />}
                {activeTab === 'emergency' && <EmergencyModule patients={patients} onOpenPatient={handleOpenPatient} />}
                {activeTab === 'outpatient' && <OutpatientModule patients={patients} onOpenPatient={handleOpenPatient} />}
                {activeTab === 'hmo' && <HMOGuarantorsModule />}
                {activeTab === 'kardex' && <NursingKardexModule />}
                {activeTab === 'wardView' && <WardViewModule patients={patients} onOpenPatient={handleOpenPatient} />}
                {activeTab === 'pharmacy' && <InventoryModule />}
                {activeTab === 'messages' && <DoctorMessagingModule />}
                {activeTab === 'account' && <AccountModule onBack={() => setActiveTab('dashboard')} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Sided Support Panel (BizBox Style) */}
          <aside className="w-80 bg-white border-l border-slate-200 hidden xl:flex flex-col shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.02)]">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Patient Status Legend</h3>
              <div className="space-y-3">
                {[
                  { label: 'Active', desc: 'Patient under management', color: 'bg-blue-500', bg: 'bg-blue-50' },
                  { label: 'MGH', desc: 'May Go Home / Clearance Pending', color: 'bg-emerald-500', bg: 'bg-emerald-50' },
                  { label: 'Cleared', desc: 'Medically cleared for discharge', color: 'bg-violet-500', bg: 'bg-violet-50' },
                  { label: 'Expired', desc: 'Patient deceased', color: 'bg-slate-400', bg: 'bg-slate-50' },
                  { label: 'Discharged', desc: 'Formal discharge process complete', color: 'bg-amber-500', bg: 'bg-amber-50' },
                ].map((item) => (
                  <div key={item.label} className={cn("p-3 rounded-xl border border-transparent hover:border-slate-100 transition-all cursor-default group", item.bg)}>
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-6 rounded-full", item.color)}></div>
                      <div>
                        <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.label}</p>
                        <p className="text-[10px] text-slate-500 font-medium leading-none mt-1">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Unit Summary</h3>
              <div className="space-y-4">
                {[
                  { ward: 'Maternity', count: patients.filter(p => p.ward === 'Maternity').length, mgh: 1 },
                  { ward: 'Cardiology', count: patients.filter(p => p.ward === 'Cardiology').length, mgh: 0 },
                  { ward: 'Pediatrics', count: patients.filter(p => p.ward === 'Pediatrics').length, mgh: 2 },
                ].map(unit => (
                  <div key={unit.ward} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{unit.ward}</span>
                      <span className="text-xs font-bold text-brand">{unit.count} Patients</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand" 
                        style={{ width: `${(unit.count / patients.length) * 100}%` }}
                      ></div>
                    </div>
                    {unit.mgh > 0 && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">{unit.mgh} MGH NOTICE</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleGenerateCensus}
                  disabled={isGeneratingCensus}
                  className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGeneratingCensus ? <Activity size={14} className="animate-pulse" /> : null}
                  {isGeneratingCensus ? 'Compiling Census...' : 'Generate Daily Census'}
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Patient Chart Modal */}
        <AnimatePresence>
          {selectedPatient && (
            <PatientChart 
              patient={selectedPatient} 
              onClose={handleCloseChart} 
              onUpdateRecord={(record) => handleUpdatePatientRecord(selectedPatient.id, record)}
              onMessageDoctor={() => {
                setActiveTab('messages');
                handleCloseChart();
              }}
            />
          )}
        </AnimatePresence>

        {/* Add Patient Modal */}
        <AnimatePresence>
          {showAddPatient && (
            <AddPatientModal 
              onClose={() => setShowAddPatient(false)} 
              onSave={handleCreatePatient}
            />
          )}
        </AnimatePresence>

        {/* Daily Census Reporting Modal */}
        <AnimatePresence>
          {showCensusReport && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCensusReport(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col border border-slate-100"
              >
                <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand rounded-2xl">
                      <Activity size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-widest">Daily Census Report</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Automated Clinical Submission • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowCensusReport(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-10 space-y-8 overflow-y-auto max-h-[70vh]">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { icon: Activity, label: 'Total Census', value: patients.length, trend: '+2', color: 'text-blue-500' },
                      { icon: TrendingUp, label: 'Occupancy', value: '88%', trend: '+4%', color: 'text-emerald-500' },
                      { icon: Clock, label: 'Avg Stay', value: '4.2d', trend: '-0.3d', color: 'text-violet-500' },
                    ].map((stat, i) => (
                      <div key={i} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                        <stat.icon className={cn("mx-auto mb-2", stat.color)} size={20} />
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</h4>
                        <div className="text-2xl font-black text-slate-800">{stat.value}</div>
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center justify-center gap-1">
                          <ArrowUpRight size={10} />
                          {stat.trend} v. Yesterday
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <TrendingUp size={16} className="text-brand" />
                      Ward Distribution Breakdown
                    </h4>
                    <div className="space-y-3">
                      {[
                        { ward: 'Maternity', count: patients.filter(p => p.ward === 'Maternity').length, capacity: 15 },
                        { ward: 'Cardiology', count: patients.filter(p => p.ward === 'Cardiology').length, capacity: 12 },
                        { ward: 'Pediatrics', count: patients.filter(p => p.ward === 'Pediatrics').length, capacity: 10 },
                        { ward: 'Executive', count: 4, capacity: 5 }
                      ].map((w, i) => (
                        <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{w.ward} Unit</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{w.count} / {w.capacity} Beds</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full transition-all duration-1000",
                                (w.count / w.capacity) > 0.8 ? "bg-red-500" : "bg-brand"
                              )} 
                              style={{ width: `${(w.count / w.capacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex gap-6 items-center">
                    <CheckCircle className="text-blue-500 shrink-0" size={32} />
                    <div>
                      <h5 className="text-xs font-black text-blue-800 uppercase tracking-widest">Certification Ready</h5>
                      <p className="text-[10px] text-blue-700 font-medium leading-relaxed mt-1">
                        All bedside validations and Kardex updates have been reconciled. This census is ready for Department of Health (DOH) standard reporting.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                  <button className="flex-1 py-4 bg-brand text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                    <Download size={16} />
                    Download Official Report
                  </button>
                  <button onClick={() => setShowCensusReport(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                    Dismiss
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
