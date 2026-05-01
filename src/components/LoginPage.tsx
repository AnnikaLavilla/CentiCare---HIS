/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Eye, EyeOff, Lock, User as UserIcon } from 'lucide-react';
import { User, Role } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = React.useState<Role>('Patient');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');

  const users: (User & { password: string })[] = [
    { username: "patient1", password: "1234", role: "Patient" },
    { username: "admin1", password: "AdminCare@2026#Secure", role: "Admin" },
    { username: "Gianne Anggong", password: "GiaN@Ang-92!P", role: "Staff" },
    { username: "Haylieh Dacumos", password: "HayL#Dac-15?M", role: "Staff" },
    { username: "Angela Dimaranan", password: "AngE!Dim-88*Q", role: "Staff" },
    { username: "Andre Gan Lim", password: "AndR&Gan-23^K", role: "Staff" },
    { username: "Annika Lavilla", password: "AnnI%Lav-74$B", role: "Staff" },
    { username: "Nikko Matulac", password: "NikK*Mat-61#F", role: "Staff" },
    { username: "Francesca Penaranda", password: "FraN(Pen-39)X", role: "Staff" },
    { username: "Jamila Rivera", password: "JamI+Riv-05=Z", role: "Staff" },
    { username: "Thomas Santiago", password: "ThoM/San-47.V", role: "Staff" },
    { username: "Daynalyn De Leon", password: "DayN~DeL-58_W", role: "Staff" },
    { username: "April Casabona", password: "AprI<Cas-12>H", role: "Staff" }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = users.find(u => 
      u.username.toLowerCase() === username.trim().toLowerCase() && 
      u.password === password.trim() && 
      u.role === selectedRole
    );

    if (user) {
      const { password: _, ...userData } = user;
      onLogin(userData);
    } else {
      setError("Invalid credentials or role mismatch");
    }
  };

  const roles: Role[] = ['Patient', 'Staff', 'Admin'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand to-brand-sidebar p-4 select-none">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-20 h-20 mb-6 bg-brand-light rounded-2xl flex items-center justify-center p-4">
            <img 
               src="/centicare-logo.png" 
               alt="CentiCare Logo" 
               className="w-full h-full object-contain z-10 relative"
               referrerPolicy="no-referrer"
               onError={(e) => {
                 e.currentTarget.style.display = 'none';
               }}
            />
            <div className="absolute inset-0 bg-brand rounded-2xl flex items-center justify-center text-white font-bold text-3xl">C</div>
          </div>
          
          <h2 className="text-3xl font-black text-slate-800 tracking-tight text-center">Welcome to CentiCare</h2>
          <p className="text-brand font-bold text-xs tracking-widest mt-1 uppercase opacity-60">Health Information System</p>
        </div>

        {/* Role Toggle */}
        <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={cn(
                "flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300",
                selectedRole === role 
                  ? "bg-brand text-white shadow-lg" 
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              {role}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <UserIcon size={18} />
            </div>
            <input
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-brand focus:bg-white rounded-2xl outline-none transition-all text-slate-800 font-medium placeholder:text-slate-400"
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent focus:border-brand focus:bg-white rounded-2xl outline-none transition-all text-slate-800 font-medium placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-end px-1">
            <button 
              type="button"
              onClick={() => alert("Please contact CentiCare admin to reset your password.")}
              className="text-xs font-bold text-brand hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-brand hover:bg-brand-hover text-white rounded-2xl font-black tracking-wide shadow-xl shadow-brand/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            LOGIN TO DASHBOARD
          </button>
        </form>

        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm font-bold text-center mt-6"
          >
            {error}
          </motion.p>
        )}

        <div className="mt-10 text-center space-y-4">
          <button 
            type="button"
            onClick={() => {
              const staffList = users.filter(u => u.role === 'Staff').map(u => `${u.username.padEnd(20)} | PW: ${u.password}`).join('\n');
              alert(`NURSING STAFF DIRECTORY\n--------------------------------------------\n${staffList}\n\nNote: Admin password is "AdminCare@2026#Secure"`);
            }}
            className="text-[10px] font-black text-slate-400 hover:text-brand tracking-widest uppercase transition-colors"
          >
            NURSING STAFF DIRECTORY
          </button>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest pb-4">
            &copy; 2026 CentiCare Health Services
          </p>
        </div>
      </motion.div>
    </div>
  );
};
