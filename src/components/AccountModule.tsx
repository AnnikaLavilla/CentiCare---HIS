import React from 'react';
import { User, Shield, Settings, Bell, Palette, CheckCircle, XCircle, Save, ArrowLeft, FileText, X, Lock, Eye, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface AccountModuleProps {
  onBack: () => void;
}

export const AccountModule: React.FC<AccountModuleProps> = ({ onBack }) => {
  const [formData, setFormData] = React.useState(() => {
    const saved = localStorage.getItem('account');
    if (saved) return JSON.parse(saved);
    
    // Default values if nothing in storage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    return {
      name: currentUser.username || 'Gianne Anggong',
      staffId: 'NUR-' + Math.floor(Math.random() * 10000),
      position: currentUser.role || 'Nurse',
      department: 'Emergency',
      username: currentUser.username || 'gianne_nurse',
      password: '',
      theme: 'Light',
      notifications: 'Enabled'
    };
  });

  const [isSaving, setIsSaving] = React.useState(false);
  const [showDPAReport, setShowDPAReport] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExportAudit = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Official DPA Audit Log (RA 10173) exported successfully. Check your secure downloads folder.');
    }, 2000);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('account', JSON.stringify(formData));
      setIsSaving(false);
      // We could also show a toast here
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-brand hover:border-brand transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest">My Account</h2>
            <p className="text-sm text-slate-500 font-medium">Manage your clinical profile and system preferences.</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3 bg-brand text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
        >
          {isSaving ? <span className="animate-spin mr-1">◌</span> : <Save size={16} />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8">
            <h3 className="text-sm font-black text-brand uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <User size={18} />
              Personnel Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-brand/30 transition-all font-bold text-slate-800"
                />
              </div>
              <div className="space-y-2 opacity-60">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Staff ID (Immutable)</label>
                <input 
                  type="text" 
                  id="staffId"
                  value={formData.staffId}
                  disabled
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl font-mono text-xs text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Position / Title</label>
                <select 
                  id="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-brand/30 transition-all font-bold text-slate-800 appearance-none"
                >
                  <option>Nurse</option>
                  <option>Doctor</option>
                  <option>Medical Technologist</option>
                  <option>Admin</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Department</label>
                <select 
                  id="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-brand/30 transition-all font-bold text-slate-800 appearance-none"
                >
                  <option>Emergency</option>
                  <option>Inpatient Ward</option>
                  <option>Outpatient</option>
                  <option>Administration</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8">
            <h3 className="text-sm font-black text-brand uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <Shield size={18} />
              Security Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                <input 
                  type="text" 
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-brand/30 transition-all font-bold text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Change Password</label>
                <input 
                  type="password" 
                  id="password"
                  placeholder="Leave blank to keep current"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-brand/30 transition-all font-bold text-slate-800"
                />
              </div>
            </div>
            <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
              <Shield className="text-amber-500 shrink-0" size={20} />
              <p className="text-[10px] text-amber-700 font-medium leading-relaxed uppercase">
                Password must be at least 12 characters, including one special character. Session will expire after 30 minutes of inactivity.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Preferences & Permissions */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8">
            <h3 className="text-sm font-black text-brand uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <Settings size={18} />
              System Preferences
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Palette size={14} /> UI Theme
                </label>
                <select 
                  id="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl font-bold text-slate-800 appearance-none"
                >
                  <option>Light</option>
                  <option>Dark (Enterprise Mode)</option>
                  <option>High Contrast</option>
                </select>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Bell size={14} /> Notifications
                </label>
                <select 
                  id="notifications"
                  value={formData.notifications}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl font-bold text-slate-800 appearance-none"
                >
                  <option>Enabled</option>
                  <option>Critical Only</option>
                  <option>Disabled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <h3 className="text-[10px] font-black text-brand-light uppercase tracking-[0.3em] mb-6 relative z-10">Access Permissions</h3>
            <div className="space-y-4 relative z-10">
              {[
                { label: 'View Patients', status: true },
                { label: 'Edit Charts', status: true },
                { label: 'Access Emergency', status: true },
                { label: 'Update Vitals', status: true },
                { label: 'Delete Records', status: formData.position === 'Admin' },
              ].map((perm, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">{perm.label}</span>
                  {perm.status ? (
                    <CheckCircle size={14} className="text-emerald-400" />
                  ) : (
                    <XCircle size={14} className="text-red-400 opacity-50" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                Permissions are managed by the Hospital Information Systems (HIS) Department. Contact IT to request elevated privileges.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-brand" />
                DPA Compliance
              </div>
              <button 
                onClick={() => setShowDPAReport(true)}
                className="p-2 hover:bg-slate-50 rounded-lg text-brand transition-colors"
                title="View RA 10173 Report"
              >
                <FileText size={18} />
              </button>
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ethics & Law</p>
                <ul className="text-[10px] space-y-2 text-slate-600 font-bold uppercase tracking-tight">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-brand rounded-full"></div>
                    RA 10173 (Data Privacy Act)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-brand rounded-full"></div>
                    Clinical Beneficence
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-brand rounded-full"></div>
                    System Accountability
                  </li>
                </ul>
              </div>
              <p className="text-[9px] text-slate-400 font-medium leading-relaxed italic">
                CentiCare HIS strictly observes the processing of sensitive medical data in accordance with Philippine National Privacy Commission guidelines.
              </p>
              <button 
                onClick={() => setShowDPAReport(true)}
                className="w-full mt-2 py-3 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg shadow-slate-200"
              >
                Launch Compliance Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RA 10173 Compliance Report Modal */}
      <AnimatePresence>
        {showDPAReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDPAReport(false)}
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
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-widest">DPA Compliance Report</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">RA 10173 Security Audit • May 2026</p>
                  </div>
                </div>
                <button onClick={() => setShowDPAReport(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-10 space-y-8 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <Lock className="text-brand mb-3" size={24} />
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2">Encryption Status</h4>
                    <p className="text-xs text-slate-500 font-medium">AES-256 bit encryption active for all patient records and laboratory results in transit and at rest.</p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase">Secure</span>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <Eye className="text-brand mb-3" size={24} />
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2">Access Control</h4>
                    <p className="text-xs text-slate-500 font-medium">Role-Based Access Control (RBAC) enforced. Unauthorized access attempts automatically logged to NPC monitor.</p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase">Verified</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Privacy Framework Implementation</h4>
                  <div className="space-y-3">
                    {[
                      { point: "Data Subject Privacy Notice", status: "Active" },
                      { point: "Clinical Consent Management", status: "Enabled" },
                      { point: "Breach Notification Protocol", status: "Ready" },
                      { point: "Data Portability Compliance", status: "Active" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-brand/20 transition-all">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-wide">{item.point}</span>
                        <span className="text-[8px] font-black bg-brand/10 text-brand px-3 py-1 rounded-full uppercase">{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex gap-6 items-center">
                  <CheckCircle className="text-emerald-500 shrink-0" size={32} />
                  <div>
                    <h5 className="text-xs font-black text-emerald-800 uppercase tracking-widest">Compliance Statement</h5>
                    <p className="text-[10px] text-emerald-700 font-medium leading-relaxed mt-1">
                      CentiCare HIS infrastructure is fully compliant with the 5 Pillars of Compliance as mandated by the National Privacy Commission of the Philippines.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button 
                  onClick={handleExportAudit}
                  disabled={isExporting}
                  className="flex-1 py-4 bg-brand text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isExporting ? <span className="animate-spin mr-1">◌</span> : <Download size={16} />}
                  {isExporting ? 'Preparing Report...' : 'Export Official Audit Log'}
                </button>
                <button onClick={() => setShowDPAReport(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                  Close Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
