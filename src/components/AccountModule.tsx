import React from 'react';
import { User, Shield, Settings, Bell, Palette, CheckCircle, XCircle, Save, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

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
        </div>
      </div>
    </div>
  );
};
