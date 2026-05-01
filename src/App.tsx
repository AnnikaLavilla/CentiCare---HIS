/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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

  const selectedPatient = React.useMemo(() => 
    patients.find(p => p.id === selectedPatientId), 
    [patients, selectedPatientId]
  );

  const handleUpdatePatientRecord = (patientId: string, record: Patient['medicalRecord']) => {
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, medicalRecord: record } : p));
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
                {activeTab === 'patients' && <PatientMasterList patients={patients} onOpenPatient={handleOpenPatient} />}
                {activeTab === 'inpatient' && <InpatientModule patients={patients} onOpenPatient={handleOpenPatient} />}
                {activeTab === 'emergency' && <EmergencyModule patients={patients} onOpenPatient={handleOpenPatient} />}
                {activeTab === 'outpatient' && <OutpatientModule patients={patients} onOpenPatient={handleOpenPatient} />}
                {activeTab === 'hmo' && <HMOGuarantorsModule />}
                {activeTab === 'kardex' && <NursingKardexModule />}
                {activeTab === 'wardView' && <WardViewModule patients={patients} onOpenPatient={handleOpenPatient} />}
                {activeTab === 'pharmacy' && <InventoryModule />}
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
                <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest shadow-sm hover:shadow-md transition-all">
                  Generate Daily Census
                </button>
                <button className="w-full py-3 bg-brand text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all">
                  Registry Dashboard
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
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
