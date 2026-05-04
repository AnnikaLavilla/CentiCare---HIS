/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { 
  X, 
  Lock, 
  Edit3, 
  ArrowLeft, 
  Save, 
  Printer, 
  FileText, 
  Activity, 
  Clipboard, 
  FlaskConical, 
  Droplet,
  User as UserIcon,
  Image,
  History,
  Shield,
  ShieldAlert,
  Scale,
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import { Patient, User } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface PatientChartProps {
  patient: Patient;
  onClose: () => void;
  onUpdateRecord: (record: Patient['medicalRecord']) => void;
  onMessageDoctor?: () => void;
}

export const PatientChart: React.FC<PatientChartProps> = ({ patient, onClose, onUpdateRecord, onMessageDoctor }) => {
  const [activeSubTab, setActiveSubTab] = React.useState<'clinical' | 'sbar' | 'meds' | 'vitals' | 'iv' | 'labs' | 'registry' | 'imaging' | 'audit'>('clinical');
  const [editingSbar, setEditingSbar] = React.useState(false);
  const [showVitalForm, setShowVitalForm] = React.useState(false);
  const [showIntakeForm, setShowIntakeForm] = React.useState(false);
  const [showOutputForm, setShowOutputForm] = React.useState(false);
  const [showIVForm, setShowIVForm] = React.useState(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = React.useState(false);
  const [showMedForm, setShowMedForm] = React.useState(false);
  const [viewingDicom, setViewingDicom] = React.useState<any>(null);
  
  const [showOrderForm, setShowOrderForm] = React.useState(false);
  const [newOrder, setNewOrder] = React.useState({ order: '', rationale: '' });
  
  const [newMed, setNewMed] = React.useState({ medication: '', dose: '', route: '', frequency: '', indication: '' });
  const [newIV, setNewIV] = React.useState({ solution: '', volume: '', rate: '', site: '' });
  const [newVital, setNewVital] = React.useState({ bp: '', rr: '', hr: '', temp: '', remarks: '' });
  const [newIntake, setNewIntake] = React.useState({ type: '', amount: '' });
  const [newOutput, setNewOutput] = React.useState({ type: '', amount: '' });
  
  const handlePrint = () => {
    window.print();
  };

  const getDicomImage = (item: any) => {
    const procedure = item.procedure?.toLowerCase() || '';
    const findings = item.findings?.toLowerCase() || '';
    
    if (procedure.includes('chest') || findings.includes('lung') || findings.includes('pleural')) {
      // Specific Radiopaedia image for Chest PA X-ray as requested
      return "https://prod-images-static.radiopaedia.org/images/2089213/f12063879a29e672f675977fabdc89_big_gallery.jpeg";
    }
    
    if (
      procedure.includes('pelvic') || 
      procedure.includes('ultrasound') || 
      procedure.includes('transvaginal') || 
      findings.includes('uterus') || 
      findings.includes('clot') ||
      findings.includes('atony') ||
      item.type === 'Ultrasound'
    ) {
      // Specific image for Pelvic Ultrasound as requested
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0e45PiObBLK2BhEwfrYcUMDLU8QNN48OcHw&s";
    }

    if (item.type === 'CT Scan') {
      // Cranial CT for Bato De La Rosa as requested
      return "https://lh4.googleusercontent.com/proxy/bfCzz5s665zyEpZyv0bTppU3eOORU5DmIxCw9mv8ZGOsx1ymaBdY4hkmlxycFieEFTB8kw21GsbSQAHCF2sBGzTbzuYz3EegpeE9PrVYjOXFQ8kiLUMMm_gnm4SYmuRdWdI5VS2ojlfH";
    }

    if (item.type === 'X-Ray') {
      return "https://prod-images-static.radiopaedia.org/images/2089213/f12063879a29e672f675977fabdc89_big_gallery.jpeg";
    }
    
    return "https://prod-images-static.radiopaedia.org/images/2089213/f12063879a29e672f675977fabdc89_big_gallery.jpeg";
  };

  const user: User | null = JSON.parse(localStorage.getItem('user') || 'null');
  const isLocked = patient.id === 'PT-001001' || patient.name === 'Antonina Borromeo' || patient.locked;
  const isNurse = user?.role === 'Staff' || user?.role === 'Admin';
  const canEditOrders = !isLocked && user?.role === 'Admin';
  const canEditNursing = !isLocked && (user?.role === 'Staff' || user?.role === 'Admin');

  const subTabs = [
    { id: 'registry', label: 'Demographics & Registry', icon: UserIcon },
    { id: 'clinical', label: 'Clinical Flow', icon: FileText },
    { id: 'sbar', label: 'SBAR Handover', icon: Clipboard },
    { id: 'meds', label: 'Medication Sheet', icon: Clipboard },
    { id: 'vitals', label: 'Vital Signs', icon: Activity },
    { id: 'iv', label: 'IV & Intake/Output', icon: Droplet },
    { id: 'labs', label: 'Lab Results', icon: FlaskConical },
    { id: 'imaging', label: 'Imaging/Radiology', icon: Image },
    { id: 'audit', label: 'Audit Logs', icon: History },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full h-full max-w-7xl rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="hidden print:flex flex-col mb-8 border-b-2 border-slate-900 pb-6 print-header">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                <Activity size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-widest text-slate-900">CENTICARE HEALTH</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Official Medical Record Audit</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-black text-slate-400 uppercase">Document Hash</p>
              <p className="text-xs font-mono text-slate-600">SHA256: {Math.random().toString(36).substring(2, 15).toUpperCase()}</p>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-4 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Patient Name</p>
              <p className="text-sm font-bold text-slate-900">{patient.name}</p>
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Patient ID</p>
              <p className="text-sm font-mono font-bold text-brand">{patient.id}</p>
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Date of Birth</p>
              <p className="text-sm font-bold text-slate-900">1980-05-12 (44 yrs)</p>
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Generated At</p>
              <p className="text-sm font-bold text-slate-900">{new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-5">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-slate-600" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900">{patient.name}</h2>
                <span className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                  patient.clinicalStatus === 'Active' ? "bg-blue-50 text-blue-600 border-blue-200" :
                  patient.clinicalStatus === 'MGH' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                  patient.clinicalStatus === 'Cleared' ? "bg-violet-50 text-violet-600 border-violet-200" :
                  patient.clinicalStatus === 'Expired' ? "bg-slate-50 text-slate-600 border-slate-200" :
                  "bg-amber-50 text-amber-600 border-amber-200"
                )}>
                  {patient.clinicalStatus || 'Active'}
                </span>
                <span className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight",
                  patient.locked ? "bg-slate-200 text-slate-600" : "bg-emerald-100 text-emerald-700"
                )}>
                  {patient.locked ? <Lock size={12} /> : <Edit3 size={12} />}
                  {patient.locked ? 'Locked Record' : 'Editable'}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                <p><b>ID:</b> {patient.id}</p>
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <p><b>Ward:</b> {patient.ward}</p>
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <p><b>Age/Sex:</b> {patient.age} yrs / {patient.gender || 'F'}</p>
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <p><b>Diagnosis:</b> {patient.diagnosis}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-slate-100 rounded-lg flex items-center gap-2 border border-slate-200">
              <div className="w-2 h-2 rounded-full bg-brand animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Active Session: {user?.role || 'Guest'}
              </span>
            </div>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-white text-slate-600 transition-all shadow-sm"
            >
              <Printer size={18} />
              <span className="font-medium text-sm">Print</span>
            </button>
            <button 
              onClick={onMessageDoctor}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-all shadow-sm"
            >
              <MessageSquare size={18} />
              <span className="font-medium text-sm">Message Physician</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover shadow-md transition-all">
              <Save size={18} />
              <span className="font-medium text-sm">Save Changes</span>
            </button>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="bg-white border-b border-slate-100 px-6 flex items-center gap-2 overflow-x-auto">
          {subTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-4 text-sm font-semibold transition-all border-b-2 relative whitespace-nowrap",
                activeSubTab === tab.id 
                  ? "text-brand border-brand bg-brand-light/20" 
                  : "text-slate-400 border-transparent hover:text-slate-600"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <AnimatePresence mode="wait">
            {activeSubTab === 'registry' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="max-w-5xl mx-auto space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-brand"></div>
                    <h4 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <UserIcon className="text-brand" size={20} />
                      Demographic Information
                    </h4>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Civil Status</p>
                          <p className="text-sm font-bold text-slate-800">{patient.demographics?.civilStatus || 'Married'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Religion</p>
                          <p className="text-sm font-bold text-slate-800">{patient.demographics?.religion || 'Catholic'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nationality</p>
                          <p className="text-sm font-bold text-slate-800">{patient.demographics?.nationality || 'Filipino'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                          <p className="text-sm font-bold text-slate-800">{patient.demographics?.phone || '0917-123-4567'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Residential Address</p>
                        <p className="text-sm font-bold text-slate-800 leading-relaxed">
                          {patient.demographics?.address || '123 Medical Drive, Brgy. Central, Quezon City, Philippines'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-slate-800"></div>
                    <h4 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <FileText className="text-slate-800" size={20} />
                      Admission & Registry
                    </h4>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Case Number</p>
                          <p className="text-sm font-mono font-bold text-slate-800">{patient.registry?.caseNumber || 'CN-2026-041'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Admission Date</p>
                          <p className="text-sm font-bold text-slate-800">{patient.admission}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Room/Bed</p>
                          <p className="text-sm font-bold text-brand">{patient.ward} - 402B</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Source of Admission</p>
                          <p className="text-sm font-bold text-slate-800">{patient.registry?.admissionSource || 'Emergency Room'}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Attending Physician</p>
                        <p className="text-sm font-bold text-slate-800">DR. {patient.registry?.attendingPhysician || 'SANTOS'}, M.D.</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">HMO / Guarantor</p>
                        <p className="text-sm font-bold text-brand uppercase">{patient.registry?.hmo || 'PhilHealth / Maxicare'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'sbar' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                <div className="flex justify-between items-center mb-4 print:hidden">
                  <h3 className="text-xl font-bold text-slate-900 uppercase">SBAR Clinical Handover</h3>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handlePrint}
                      className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white text-slate-600 transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                      <Printer size={14} />
                      Print Handover
                    </button>
                    {canEditNursing && (
                      editingSbar ? (
                        <button 
                          onClick={() => setEditingSbar(false)}
                          className="text-[10px] font-black bg-emerald-600 text-white px-3 py-1.5 rounded-lg shadow-lg shadow-emerald-200 hover:scale-105 transition-all"
                        >
                          FINISH EDITING
                        </button>
                      ) : (
                        <button 
                          onClick={() => setEditingSbar(true)}
                          className="text-[10px] font-black bg-brand text-white px-3 py-1.5 rounded-lg shadow-lg shadow-brand/20 hover:scale-105 transition-all"
                        >
                          EDIT SBAR
                        </button>
                      )
                    )}
                    <div className="text-xs font-mono text-slate-400">Generated: {new Date().toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="grid gap-6">
                  {/* Situation */}
                  <div className="bg-white rounded-2xl border-l-[6px] border-red-500 shadow-sm overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600 font-bold">S</div>
                        <h4 className="font-bold text-red-700 uppercase tracking-wide">Situation</h4>
                      </div>
                      {editingSbar ? (
                        <textarea 
                          className="w-full text-slate-700 leading-relaxed font-medium p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20"
                          value={patient.medicalRecord.sbar?.situation}
                          onChange={(e) => onUpdateRecord({
                            ...patient.medicalRecord,
                            sbar: { ...patient.medicalRecord.sbar!, situation: e.target.value }
                          })}
                        />
                      ) : (
                        <p className="text-slate-700 leading-relaxed font-medium">
                          {patient.medicalRecord.sbar?.situation || 'No situation report recorded.'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Background */}
                  <div className="bg-white rounded-2xl border-l-[6px] border-amber-500 shadow-sm overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 font-bold">B</div>
                        <h4 className="font-bold text-amber-700 uppercase tracking-wide">Background</h4>
                      </div>
                      {editingSbar ? (
                        <textarea 
                          className="w-full text-slate-700 leading-relaxed italic p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20"
                          value={patient.medicalRecord.sbar?.background}
                          onChange={(e) => onUpdateRecord({
                            ...patient.medicalRecord,
                            sbar: { ...patient.medicalRecord.sbar!, background: e.target.value }
                          })}
                        />
                      ) : (
                        <p className="text-slate-700 leading-relaxed italic">
                          {patient.medicalRecord.sbar?.background || 'No background information available.'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Assessment */}
                  <div className="bg-white rounded-2xl border-l-[6px] border-blue-500 shadow-sm overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-light flex items-center justify-center text-brand font-bold">A</div>
                        <h4 className="font-bold text-brand uppercase tracking-wide">Assessment</h4>
                      </div>
                      {editingSbar ? (
                        <textarea 
                          className="w-full text-slate-700 leading-relaxed p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                          value={patient.medicalRecord.sbar?.assessment}
                          onChange={(e) => onUpdateRecord({
                            ...patient.medicalRecord,
                            sbar: { ...patient.medicalRecord.sbar!, assessment: e.target.value }
                          })}
                        />
                      ) : (
                        <p className="text-slate-700 leading-relaxed">
                          {patient.medicalRecord.sbar?.assessment || 'No clinical assessment provided.'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-white rounded-2xl border-l-[6px] border-emerald-500 shadow-sm overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">R</div>
                        <h4 className="font-bold text-emerald-700 uppercase tracking-wide">Recommendation</h4>
                      </div>
                      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                        {editingSbar ? (
                          <textarea 
                            className="w-full text-slate-800 font-semibold leading-relaxed p-3 bg-transparent border-none outline-none focus:ring-2 focus:ring-emerald-500/20"
                            value={patient.medicalRecord.sbar?.recommendation}
                            onChange={(e) => onUpdateRecord({
                              ...patient.medicalRecord,
                              sbar: { ...patient.medicalRecord.sbar!, recommendation: e.target.value }
                            })}
                          />
                        ) : (
                          <p className="text-slate-800 font-semibold leading-relaxed">
                            {patient.medicalRecord.sbar?.recommendation || 'No recommendations noted.'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'clinical' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Clipboard className="text-brand" size={20} />
                      Doctor’s Orders
                    </h3>
                    {canEditOrders && (
                      <button 
                        onClick={() => setShowOrderForm(!showOrderForm)}
                        className={cn(
                          "text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg transition-all",
                          showOrderForm ? "bg-slate-100 text-slate-600" : "bg-brand text-white shadow-brand/20 hover:scale-105"
                        )}
                      >
                        {showOrderForm ? 'CANCEL' : '+ ADD ORDER'}
                      </button>
                    )}
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-xs uppercase text-slate-400 font-bold border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-3">Date/Time</th>
                          <th className="px-6 py-3">Order</th>
                          <th className="px-6 py-3">Rationale</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {showOrderForm && (
                          <tr className="bg-brand-light/10">
                            <td className="px-6 py-4 text-xs font-mono">{new Date().toLocaleString()}</td>
                            <td className="px-6 py-4"><input placeholder="Order description..." className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-sm" value={newOrder.order} onChange={e => setNewOrder({...newOrder, order: e.target.value})} /></td>
                            <td className="px-6 py-4 flex gap-3 items-center">
                              <input placeholder="Rationale" className="flex-1 bg-white border border-slate-200 rounded px-3 py-1.5 text-sm" value={newOrder.rationale} onChange={e => setNewOrder({...newOrder, rationale: e.target.value})} />
                              <button 
                                onClick={() => {
                                  onUpdateRecord({
                                    ...patient.medicalRecord,
                                    doctorOrders: [...patient.medicalRecord.doctorOrders, { 
                                      dateTime: new Date().toLocaleString(), 
                                      order: newOrder.order,
                                      rationale: newOrder.rationale
                                    }]
                                  });
                                  setNewOrder({ order: '', rationale: '' });
                                  setShowOrderForm(false);
                                }}
                                className="bg-brand text-white px-4 py-2 rounded text-[10px] font-black shrink-0"
                              >
                                SAVE
                              </button>
                            </td>
                          </tr>
                        )}
                        {patient.medicalRecord.doctorOrders.map((order, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 text-sm font-medium text-slate-600 whitespace-nowrap">{order.dateTime}</td>
                            <td className="px-6 py-4 text-sm text-slate-800">{order.order}</td>
                            <td className="px-6 py-4 text-sm text-slate-500 italic">{order.rationale}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </motion.div>
            )}

            {activeSubTab === 'meds' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Clipboard size={20} className="text-brand" />
                    Medication Administration Record
                  </h3>
                  {canEditNursing && (
                    <button 
                      onClick={() => setShowMedForm(!showMedForm)}
                      className={cn(
                        "text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg transition-all",
                        showMedForm ? "bg-slate-100 text-slate-600" : "bg-brand text-white shadow-brand/20 hover:scale-105"
                      )}
                    >
                      {showMedForm ? 'CANCEL' : '+ ADD MEDICATION'}
                    </button>
                  )}
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-400 font-bold border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-3 border-r border-slate-100">Date & Time</th>
                        <th className="px-4 py-3 border-r border-slate-100">Medication</th>
                        <th className="px-4 py-3 border-r border-slate-100">Dose</th>
                        <th className="px-4 py-3 border-r border-slate-100">Route</th>
                        <th className="px-4 py-3 border-r border-slate-100">Freq</th>
                        <th className="px-4 py-3">Indication</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {showMedForm && (
                        <tr className="bg-brand-light/10">
                          <td className="px-2 py-2 text-[10px] font-mono">{new Date().toLocaleDateString()}</td>
                          <td className="px-2 py-2"><input placeholder="Med" className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs" value={newMed.medication} onChange={e => setNewMed({...newMed, medication: e.target.value})} /></td>
                          <td className="px-2 py-2"><input placeholder="Dose" className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs" value={newMed.dose} onChange={e => setNewMed({...newMed, dose: e.target.value})} /></td>
                          <td className="px-2 py-2"><input placeholder="Route" className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs" value={newMed.route} onChange={e => setNewMed({...newMed, route: e.target.value})} /></td>
                          <td className="px-2 py-2"><input placeholder="Freq" className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs" value={newMed.frequency} onChange={e => setNewMed({...newMed, frequency: e.target.value})} /></td>
                          <td className="px-2 py-2 flex gap-2">
                            <input placeholder="Indication" className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-xs" value={newMed.indication} onChange={e => setNewMed({...newMed, indication: e.target.value})} />
                            <button 
                              onClick={() => {
                                onUpdateRecord({
                                  ...patient.medicalRecord,
                                  medications: [...patient.medicalRecord.medications, { 
                                    ...newMed, 
                                    dateTime: new Date().toLocaleString(),
                                    nursingResponsibility: '' 
                                  }]
                                });
                                setNewMed({ medication: '', dose: '', route: '', frequency: '', indication: '' });
                                setShowMedForm(false);
                              }}
                              className="bg-brand text-white px-2 py-1 rounded text-[10px] font-black"
                            >
                              SAVE
                            </button>
                          </td>
                        </tr>
                      )}
                      {patient.medicalRecord.medications.map((med, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="px-4 py-4 text-sm text-slate-600 border-r border-slate-100">{med.dateTime}</td>
                          <td className="px-4 py-4 text-sm font-bold text-slate-800 border-r border-slate-100">{med.medication}</td>
                          <td className="px-4 py-4 text-sm text-slate-800 border-r border-slate-100">{med.dose}</td>
                          <td className="px-4 py-4 text-sm text-center border-r border-slate-100">
                            <span className="px-2 py-0.5 bg-brand-light text-brand rounded-md font-bold text-[10px]">{med.route}</span>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600 border-r border-slate-100">{med.frequency}</td>
                          <td className="px-4 py-4 text-xs text-slate-500 leading-relaxed">{med.indication}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'vitals' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-bold text-slate-800">Vital Signs Trends</h4>
                      {canEditNursing && (
                        <button 
                          onClick={() => setShowVitalForm(!showVitalForm)}
                          className={cn(
                            "text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg transition-all",
                            showVitalForm ? "bg-slate-100 text-slate-600" : "bg-brand text-white shadow-brand/20 hover:scale-105"
                          )}
                        >
                          {showVitalForm ? 'CANCEL' : '+ RECORD VITALS'}
                        </button>
                      )}
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-[10px] font-bold text-slate-500">HR</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-black"></div><span className="text-[10px] font-bold text-slate-500">TEMP</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-[10px] font-bold text-slate-500">RR</span></div>
                      </div>
                    </div>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={patient.medicalRecord.vitals.map(v => ({
                          ...v,
                          hr: typeof v.hr === 'number' ? v.hr : parseFloat(v.hr),
                          temp: parseFloat(v.temp),
                          rr: parseFloat(v.rr)
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="time" 
                            tick={{ fontSize: 10, fill: '#94a3b8' }} 
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis 
                            tick={{ fontSize: 10, fill: '#94a3b8' }} 
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend verticalAlign="top" height={36}/>
                          <Line 
                            name="Heart Rate (bpm)"
                            type="monotone" 
                            dataKey="hr" 
                            stroke="#ef4444" 
                            strokeWidth={3} 
                            dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6 }}
                          />
                          <Line 
                            name="Temperature (°C)"
                            type="monotone" 
                            dataKey="temp" 
                            stroke="#000000" 
                            strokeWidth={2} 
                            dot={{ r: 3, fill: '#000000', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 5 }}
                          />
                          <Line 
                            name="Respiration (cpm)"
                            type="monotone" 
                            dataKey="rr" 
                            stroke="#3b82f6" 
                            strokeWidth={2} 
                            dot={{ r: 3, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-xs uppercase text-slate-400 font-bold border-b border-slate-100">
                        <tr>
                          <th className="px-4 py-3">Time</th>
                          <th className="px-4 py-3 text-center">BP</th>
                          <th className="px-4 py-3 text-center">RR</th>
                          <th className="px-4 py-3 text-center">HR</th>
                          <th className="px-4 py-3 text-center">Temp</th>
                          <th className="px-4 py-3">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {showVitalForm && (
                          <tr className="bg-brand-light/10">
                            <td className="px-4 py-3 text-xs font-mono">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                            <td className="px-4 py-3"><input placeholder="BP" className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs" value={newVital.bp} onChange={e => setNewVital({...newVital, bp: e.target.value})} /></td>
                            <td className="px-4 py-3"><input placeholder="RR" className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs" value={newVital.rr} onChange={e => setNewVital({...newVital, rr: e.target.value})} /></td>
                            <td className="px-4 py-3"><input placeholder="HR" className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs" value={newVital.hr} onChange={e => setNewVital({...newVital, hr: e.target.value})} /></td>
                            <td className="px-4 py-3"><input placeholder="Temp" className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs" value={newVital.temp} onChange={e => setNewVital({...newVital, temp: e.target.value})} /></td>
                            <td className="px-4 py-3 flex gap-2">
                              <input placeholder="Remarks" className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-xs" value={newVital.remarks} onChange={e => setNewVital({...newVital, remarks: e.target.value})} />
                              <button 
                                onClick={() => {
                                  onUpdateRecord({
                                    ...patient.medicalRecord,
                                    vitals: [...patient.medicalRecord.vitals, { 
                                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                      bp: newVital.bp,
                                      rr: newVital.rr,
                                      hr: parseInt(newVital.hr || '0'),
                                      temp: newVital.temp,
                                      remarks: newVital.remarks
                                    }]
                                  });
                                  setNewVital({ bp: '', rr: '', hr: '', temp: '', remarks: '' });
                                  setShowVitalForm(false);
                                }}
                                className="bg-brand text-white px-2 py-1 rounded text-[10px] font-black"
                              >
                                SAVE
                              </button>
                            </td>
                          </tr>
                        )}
                        {patient.medicalRecord.vitals.map((v, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 text-sm font-medium text-slate-600">{v.time}</td>
                            <td className="px-4 py-3 text-sm text-center font-bold text-slate-800">{v.bp}</td>
                            <td className="px-4 py-3 text-sm text-center text-slate-600">{v.rr}</td>
                            <td className="px-4 py-3 text-sm text-center font-bold text-brand">{v.hr}</td>
                            <td className="px-4 py-3 text-sm text-center text-red-500 font-medium">{v.temp}°C</td>
                            <td className="px-4 py-3 text-xs text-slate-500 italic">{v.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'iv' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800">IV Sheet</h3>
                    {canEditNursing && (
                      <button 
                        onClick={() => setShowIVForm(!showIVForm)}
                        className={cn(
                          "text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg transition-all",
                          showIVForm ? "bg-slate-100 text-slate-600" : "bg-brand text-white shadow-brand/20 hover:scale-105"
                        )}
                      >
                        {showIVForm ? 'CANCEL' : '+ NEW IV'}
                      </button>
                    )}
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-xs uppercase text-slate-400 font-bold border-b border-slate-100">
                        <tr>
                          <th className="px-4 py-3">Solution</th>
                          <th className="px-4 py-3">Volume</th>
                          <th className="px-4 py-3">Rate</th>
                          <th className="px-4 py-3">Site</th>
                          <th className="px-4 py-3">Condition</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {showIVForm && (
                          <tr className="bg-brand-light/10">
                            <td className="px-4 py-3"><input placeholder="Solution" className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold" value={newIV.solution} onChange={e => setNewIV({...newIV, solution: e.target.value})} /></td>
                            <td className="px-4 py-3"><input placeholder="Vol" className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs" value={newIV.volume} onChange={e => setNewIV({...newIV, volume: e.target.value})} /></td>
                            <td className="px-4 py-3"><input placeholder="Rate" className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs" value={newIV.rate} onChange={e => setNewIV({...newIV, rate: e.target.value})} /></td>
                            <td className="px-4 py-3"><input placeholder="Site" className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs" value={newIV.site} onChange={e => setNewIV({...newIV, site: e.target.value})} /></td>
                            <td className="px-4 py-3 text-right">
                              <button 
                                onClick={() => {
                                  onUpdateRecord({
                                    ...patient.medicalRecord,
                                    ivSheet: [...patient.medicalRecord.ivSheet, { 
                                      ...newIV,
                                      dropRate: '',
                                      condition: 'Infusing',
                                      remarks: ''
                                    }]
                                  });
                                  setNewIV({ solution: '', volume: '', rate: '', site: '' });
                                  setShowIVForm(false);
                                }}
                                className="bg-brand text-white px-4 py-1 rounded text-[10px] font-black"
                              >
                                SAVE
                              </button>
                            </td>
                          </tr>
                        )}
                        {patient.medicalRecord.ivSheet.map((iv, i) => (
                          <tr key={i}>
                            <td className="px-4 py-4 text-sm font-bold text-slate-800">{iv.solution}</td>
                            <td className="px-4 py-4 text-sm text-slate-600">{iv.volume}</td>
                            <td className="px-4 py-4 text-sm text-slate-600">{iv.rate} ({iv.dropRate})</td>
                            <td className="px-4 py-4 text-sm text-slate-600">{iv.site}</td>
                            <td className="px-4 py-4 text-xs font-medium text-emerald-600">{iv.condition}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                      <h4 className="font-bold text-slate-800">Intake</h4>
                      {canEditNursing && (
                        <button 
                          onClick={() => setShowIntakeForm(!showIntakeForm)}
                          className={cn(
                            "text-[10px] font-black transition-all",
                            showIntakeForm ? "text-slate-400" : "text-brand hover:underline"
                          )}
                        >
                          {showIntakeForm ? 'CANCEL' : '+ ADD INTAKE'}
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {showIntakeForm && (
                        <div className="flex gap-2 mb-4 p-2 bg-brand-light/10 rounded-lg">
                          <input placeholder="Type" className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-xs" value={newIntake.type} onChange={e => setNewIntake({...newIntake, type: e.target.value})} />
                          <input placeholder="Amt" className="w-24 bg-white border border-slate-200 rounded px-2 py-1 text-xs" value={newIntake.amount} onChange={e => setNewIntake({...newIntake, amount: e.target.value})} />
                          <button 
                            onClick={() => {
                              onUpdateRecord({
                                ...patient.medicalRecord,
                                intakeOutput: {
                                  ...patient.medicalRecord.intakeOutput,
                                  intake: [...patient.medicalRecord.intakeOutput.intake, { ...newIntake }]
                                }
                              });
                              setNewIntake({ type: '', amount: '' });
                              setShowIntakeForm(false);
                            }}
                            className="bg-brand text-white px-2 py-1 rounded text-[10px] font-black"
                          >
                            ADD
                          </button>
                        </div>
                      )}
                      {patient.medicalRecord.intakeOutput.intake.map((io, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                          <span className="text-sm text-slate-600">{io.type}</span>
                          <span className="text-sm font-bold text-slate-800">{io.amount}</span>
                        </div>
                      ))}
                      {patient.medicalRecord.intakeOutput.intake.length === 0 && (
                        <p className="text-xs text-slate-400 italic text-center py-4">No intake recorded.</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                      <h4 className="font-bold text-slate-800">Output</h4>
                      {canEditNursing && (
                        <button 
                          onClick={() => setShowOutputForm(!showOutputForm)}
                          className={cn(
                            "text-[10px] font-black transition-all",
                            showOutputForm ? "text-slate-400" : "text-red-500 hover:underline"
                          )}
                        >
                          {showOutputForm ? 'CANCEL' : '+ ADD OUTPUT'}
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {showOutputForm && (
                        <div className="flex gap-2 mb-4 p-2 bg-red-50 rounded-lg">
                          <input placeholder="Type" className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-xs" value={newOutput.type} onChange={e => setNewOutput({...newOutput, type: e.target.value})} />
                          <input placeholder="Amt" className="w-24 bg-white border border-slate-200 rounded px-2 py-1 text-xs" value={newOutput.amount} onChange={e => setNewOutput({...newOutput, amount: e.target.value})} />
                          <button 
                            onClick={() => {
                              onUpdateRecord({
                                ...patient.medicalRecord,
                                intakeOutput: {
                                  ...patient.medicalRecord.intakeOutput,
                                  output: [...patient.medicalRecord.intakeOutput.output, { ...newOutput }]
                                }
                              });
                              setNewOutput({ type: '', amount: '' });
                              setShowOutputForm(false);
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded text-[10px] font-black"
                          >
                            ADD
                          </button>
                        </div>
                      )}
                      {patient.medicalRecord.intakeOutput.output.map((io, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                          <span className="text-sm text-slate-600">{io.type}</span>
                          <span className="text-sm font-bold text-red-600">{io.amount}</span>
                        </div>
                      ))}
                      {patient.medicalRecord.intakeOutput.output.length === 0 && (
                        <p className="text-xs text-slate-400 italic text-center py-4">No output recorded.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'imaging' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-5xl mx-auto space-y-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-800 uppercase flex items-center gap-2">
                    <Image size={24} className="text-brand" />
                    Imaging & Radiology Reports
                  </h3>
                </div>
                
                <div className="grid gap-6">
                  {patient.medicalRecord.imaging?.map((img, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
                      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1 bg-brand text-white text-[10px] font-black rounded-lg uppercase tracking-widest">{img.type}</span>
                          <h4 className="font-bold text-slate-800">{img.procedure}</h4>
                        </div>
                        <span className="text-xs font-mono text-slate-400">{img.date}</span>
                      </div>
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-2">Clinical Findings</p>
                          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{img.findings}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Radiological Impression</p>
                          <p className="text-sm font-bold text-slate-800 leading-relaxed bg-emerald-50/30 p-4 rounded-xl border border-emerald-100">{img.impression}</p>
                        </div>
                      </div>
                      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                        <button 
                          onClick={() => setViewingDicom(img)}
                          className="text-[10px] font-black text-slate-400 hover:text-brand transition-colors uppercase tracking-widest"
                        >
                          View Original Image (DICOM)
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!patient.medicalRecord.imaging || patient.medicalRecord.imaging.length === 0) && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Image size={32} className="text-slate-300" />
                      </div>
                      <p className="text-slate-500 font-medium">No imaging reports available for this patient.</p>
                      <p className="text-xs text-slate-400 mt-1">Contact Radiology Department for status updates.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeSubTab === 'audit' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-5xl mx-auto space-y-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-800 uppercase flex items-center gap-2">
                    <History size={24} className="text-brand" />
                    Medical Record Audit Trail
                  </h3>
                  <button 
                    onClick={() => setShowPrivacyNotice(true)}
                    className="text-[10px] font-black bg-slate-800 text-white px-3 py-1.5 rounded-lg tracking-widest uppercase hover:bg-brand transition-colors flex items-center gap-2"
                  >
                    <Shield size={12} />
                    Data Privacy Act Compliant
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="w-48">Timestamp</div>
                    <div className="w-48">User Entity</div>
                    <div className="w-48">Action Type</div>
                    <div className="flex-1">Detailed Logs</div>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {patient.medicalRecord.auditLogs?.map((log, i) => (
                      <div key={i} className="p-4 flex gap-4 items-center hover:bg-slate-50 transition-colors">
                        <div className="w-48 text-xs font-mono text-slate-500">{log.timestamp}</div>
                        <div className="w-48">
                          <p className="text-xs font-bold text-slate-800 uppercase">{log.user}</p>
                          <p className="text-[9px] font-black text-brand tracking-tighter uppercase">Authorized Provider</p>
                        </div>
                        <div className="w-48">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter",
                            log.action.includes('Viewed') ? "bg-blue-100 text-blue-700" : 
                            log.action.includes('Update') ? "bg-amber-100 text-amber-700" :
                            "bg-emerald-100 text-emerald-700"
                          )}>
                            {log.action}
                          </span>
                        </div>
                        <div className="flex-1 text-xs text-slate-600 italic">
                          {log.details}
                        </div>
                      </div>
                    ))}
                    {(!patient.medicalRecord.auditLogs || patient.medicalRecord.auditLogs.length === 0) && (
                      <div className="p-12 text-center text-slate-400 italic text-sm">
                        No audit logs found for this clinical session.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'labs' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center mb-4 print:hidden">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <FlaskConical size={20} className="text-brand" />
                    Laboratory Investigation Results
                  </h3>
                  <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white text-slate-600 transition-all text-[10px] font-black uppercase tracking-widest"
                  >
                    <Printer size={14} />
                    Print Lab Report
                  </button>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-400 font-bold border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-3">Test</th>
                        <th className="px-6 py-3">Normal Values</th>
                        <th className="px-6 py-3 text-center">Result</th>
                        <th className="px-6 py-3">Interpretation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {patient.medicalRecord.labs.map((lab, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 text-sm font-bold text-slate-800">{lab.test}</td>
                          <td className="px-6 py-4 text-sm text-slate-500 font-mono italic">{lab.normalValues}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-sm font-bold uppercase",
                              lab.result === '↓' ? "bg-red-100 text-red-700" :
                              lab.result === 'Normal/↑' ? "bg-emerald-100 text-emerald-700" :
                              "bg-slate-100 text-slate-700"
                            )}>
                              {lab.result}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{lab.interpretation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RA 10173 Privacy Enforcement Modal */}
      <AnimatePresence>
        {showPrivacyNotice && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrivacyNotice(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col border border-slate-100"
            >
              <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Shield className="text-brand" size={20} />
                  <h3 className="text-lg font-black uppercase tracking-widest">Privacy Enforcement</h3>
                </div>
                <button onClick={() => setShowPrivacyNotice(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none mb-1">RA 10173 Compliance</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Active for Patient {patient.id}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    This medical record is processed under the strict guidelines of the <strong className="text-slate-800">Data Privacy Act (DPA) of 2012</strong>. Any unauthorized access, modification, or sharing of this data is a violation punishable by Philippine law.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-100 rounded-2xl">
                    <Lock className="text-brand-light font-black mb-2" size={16} />
                    <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-1">Encryption</h5>
                    <p className="text-[9px] text-slate-400 font-medium uppercase">AES-256 Cloud Shield active</p>
                  </div>
                  <div className="p-4 border border-slate-100 rounded-2xl">
                    <Scale className="text-brand-light font-black mb-2" size={16} />
                    <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-1">Consent</h5>
                    <p className="text-[9px] text-slate-400 font-medium uppercase">Clinical disclosure active</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Security Protocols</h6>
                  {[
                    "Role-Based Access Control (RBAC) enforced",
                    "Audit logging of all viewing sessions",
                    "PII Data masking for transit reports",
                    "Discharge Data Purge protocol ready"
                  ].map((p, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
                      <div className="w-1 h-1 bg-brand rounded-full"></div>
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">{p}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
                  <ShieldAlert className="text-amber-500 shrink-0" size={20} />
                  <p className="text-[9px] text-amber-700 font-bold uppercase tracking-tight leading-relaxed">
                    By viewing this record, you acknowledge your duty of confidentiality as a medical professional. All actions are timestamped and linked to your staff ID.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <button 
                  onClick={() => setShowPrivacyNotice(false)}
                  className="w-full py-4 bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-xl shadow-slate-200"
                >
                  Return to Patient Chart
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* DICOM Viewer Modal */}
      <AnimatePresence>
        {viewingDicom && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingDicom(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 w-full max-w-5xl h-[85vh] rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col border border-white/10"
            >
              {/* Toolbar */}
              <div className="bg-slate-800 p-6 flex justify-between items-center border-b border-white/10">
                <div className="flex items-center gap-6">
                  <div className="p-3 bg-brand rounded-2xl">
                    <Activity size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-widest leading-none mb-1">CentiView™ DICOM Node</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{viewingDicom.procedure} - ID: {patient.id}-IMG-{Math.floor(Math.random() * 1000)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex bg-slate-700/50 rounded-xl p-1 border border-white/5">
                    <button className="px-4 py-2 text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">Lut: Bone</button>
                    <button className="px-4 py-2 text-[10px] font-black bg-brand text-white rounded-lg uppercase tracking-widest">Lut: Invert</button>
                    <button className="px-4 py-2 text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">Zoom: 100%</button>
                  </div>
                  <button 
                    onClick={() => setViewingDicom(null)}
                    className="p-3 hover:bg-white/10 rounded-2xl transition-colors text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Viewer Area */}
              <div className="flex-1 relative bg-black flex items-center justify-center p-8 overflow-hidden group">
                <div className="absolute top-8 left-8 space-y-4 z-10">
                  <div className="p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white font-mono text-[10px] space-y-1">
                    <p>Name: {patient.name}</p>
                    <p>DOB: 1980-05-12</p>
                    <p>Sex: {patient.gender || 'F'}</p>
                    <p>Series: 1/1</p>
                    <p>Slice: 14/32</p>
                    <p className="text-brand">Modality: {viewingDicom.type}</p>
                  </div>
                </div>

                <div className="absolute bottom-8 right-8 z-10">
                  <div className="p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
                    <div className="w-12 h-12 border-l-2 border-b-2 border-white/40 flex items-end p-2">
                      <span className="text-[8px] font-bold text-white/60">5cm</span>
                    </div>
                  </div>
                </div>

                {/* The Image */}
                <motion.div 
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="relative cursor-crosshair h-full flex items-center justify-center"
                >
                  <img 
                    src={getDicomImage(viewingDicom)} 
                    alt="DICOM View"
                    className="max-h-full rounded-lg shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-brand/5 pointer-events-none mix-blend-overlay"></div>
                </motion.div>

                {/* Controls Overlay */}
                <div className="absolute bottom-10 left-10 flex gap-4 no-print">
                  <button 
                    onClick={() => setViewingDicom(null)}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all"
                  >
                    <Printer size={20} />
                  </button>
                </div>
              </div>

              {/* Status Bar */}
              <div className="bg-slate-900 px-8 py-3 border-t border-white/5 flex justify-between items-center">
                <div className="flex gap-6 items-center">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Hounsfield Unit: -24</span>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Resolution: 512x512</span>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Lossless Stream Active</span>
                </div>
                <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                  Licensed to: Holy Cross Hospital - Radiology Dept
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
