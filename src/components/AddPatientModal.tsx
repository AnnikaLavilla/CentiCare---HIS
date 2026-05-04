/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, User, Shield, MapPin, Phone, Calendar, Heart, Globe, CreditCard, Stethoscope, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { Patient } from '../types';

interface AddPatientModalProps {
  onClose: () => void;
  onSave: (patient: Patient) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    age: '',
    gender: 'Male' as Patient['gender'],
    status: 'Inpatient' as Patient['status'],
    diagnosis: '',
    ward: 'Maternity',
    address: '',
    phone: '',
    civilStatus: 'Single',
    nationality: 'Filipino',
    religion: 'Catholic',
    hmo: 'None',
    physician: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPatient: Patient = {
      id: `P-${Math.floor(100000 + Math.random() * 900000)}`,
      name: formData.name,
      age: parseInt(formData.age) || 0,
      gender: formData.gender,
      status: formData.status,
      clinicalStatus: 'Active',
      admission: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      discharge: '--',
      ward: formData.ward,
      diagnosis: formData.diagnosis,
      locked: false,
      demographics: {
        address: formData.address,
        phone: formData.phone,
        civilStatus: formData.civilStatus,
        religion: formData.religion,
        nationality: formData.nationality,
      },
      registry: {
        caseNumber: `C-${Math.floor(100000 + Math.random() * 900000)}`,
        hmo: formData.hmo,
        attendingPhysician: formData.physician,
        admissionSource: 'Emergency Room',
      },
      medicalRecord: {
        medications: [],
        doctorOrders: [],
        vitals: [],
        intakeOutput: { intake: [], output: [] },
        ivSheet: [],
        labs: [],
        auditLogs: [{
          timestamp: new Date().toLocaleString(),
          user: 'Staff Admin',
          action: 'REGISTRATION',
          details: 'Patient registered in the system'
        }]
      }
    };

    onSave(newPatient);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col border border-slate-100 max-h-[90vh]"
      >
        <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand rounded-2xl">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-widest text-white">Patient Registration</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">New Medical Record Admission</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-12">
          {/* Section: Basic Information */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Shield size={18} className="text-brand" />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Personal Identification</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name (Last, First, M.I.)</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-brand outline-none transition-all" 
                  placeholder="e.g. DELA CRUZ, JUAN P."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Age</label>
                <input 
                  required
                  type="number" 
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-brand outline-none transition-all" 
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Gender</label>
                <select 
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-brand outline-none transition-all appearance-none"
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value as any})}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Civil Status</label>
                <select 
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-brand outline-none transition-all appearance-none"
                  value={formData.civilStatus}
                  onChange={e => setFormData({...formData, civilStatus: e.target.value})}
                >
                  <option>Single</option>
                  <option>Married</option>
                  <option>Widowed</option>
                  <option>Separated</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nationality</label>
                <input 
                  type="text" 
                  value={formData.nationality}
                  onChange={e => setFormData({...formData, nationality: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-brand outline-none transition-all" 
                />
              </div>
            </div>
          </section>

          {/* Section: Contact & Address */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <MapPin size={18} className="text-brand" />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Contact & Demographics</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Residential Address</label>
                <input 
                  required
                  type="text" 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-brand outline-none transition-all" 
                  placeholder="Blk, Lot, Street, Barangay, City/Province"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-brand outline-none transition-all" 
                  placeholder="09xx xxx xxxx"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Religion</label>
                <input 
                  type="text" 
                  value={formData.religion}
                  onChange={e => setFormData({...formData, religion: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-brand outline-none transition-all" 
                />
              </div>
            </div>
          </section>

          {/* Section: Clinical Assignment */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Stethoscope size={18} className="text-brand" />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Clinical Admission & Billing</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Admission Type</label>
                <select 
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-brand outline-none transition-all appearance-none"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as any})}
                >
                  <option>Inpatient</option>
                  <option>Outpatient</option>
                  <option>Emergency</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Assigned Ward/Unit</label>
                <select 
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-brand outline-none transition-all appearance-none"
                  value={formData.ward}
                  onChange={e => setFormData({...formData, ward: e.target.value})}
                >
                  <option>Maternity</option>
                  <option>Cardiology</option>
                  <option>Pediatrics</option>
                  <option>Emergency Room</option>
                  <option>Outpatient Dept</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Attending Physician</label>
                <input 
                  required
                  type="text" 
                  value={formData.physician}
                  onChange={e => setFormData({...formData, physician: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-brand outline-none transition-all" 
                  placeholder="Dr. Surname"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Initial Diagnosis / Complaint</label>
                <input 
                  required
                  type="text" 
                  value={formData.diagnosis}
                  onChange={e => setFormData({...formData, diagnosis: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-brand outline-none transition-all" 
                  placeholder="Reason for admission"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">HMO / Guarantor</label>
                <input 
                  type="text" 
                  value={formData.hmo}
                  onChange={e => setFormData({...formData, hmo: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-brand outline-none transition-all" 
                  placeholder="e.g. Maxicare, PhilHealth"
                />
              </div>
            </div>
          </section>

          <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4 -mx-10 -mb-10 mt-10">
            <button 
              type="submit"
              className="flex-1 py-4 bg-brand text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Finalize & Register Patient
            </button>
            <button 
              type="button"
              onClick={onClose} 
              className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all font-sans"
            >
              Cancel Registration
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
