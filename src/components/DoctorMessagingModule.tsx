/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Send, User, ChevronRight, Search, Circle, Clock, AlertCircle, X, Paperclip, Phone, Mic, MicOff, PhoneOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  status: 'online' | 'busy' | 'offline';
  unread?: number;
}

const DOCTORS: Doctor[] = [
  { id: 'D1', name: 'Dr. Vicky Belo', specialty: 'Dermatology', status: 'online', unread: 2 },
  { id: 'D2', name: 'Dr. Willie Ong', specialty: 'Internal Med', status: 'busy' },
  { id: 'D3', name: 'Dr. Alvin Francisco', specialty: 'Radiology', status: 'online' },
  { id: 'D4', name: 'Dr. Mendoza-Reyes', specialty: 'Pediatrics', status: 'online' },
  { id: 'D5', name: 'Dr. Bautista-Cruz', specialty: 'Cardiology', status: 'offline' },
  { id: 'D6', name: 'Dr. Santos-Dela Cruz', specialty: 'General Surgery', status: 'online', unread: 5 },
];

export const DoctorMessagingModule: React.FC = () => {
  const [selectedDoctorId, setSelectedDoctorId] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState('');
  const [isCalling, setIsCalling] = React.useState(false);
  const [callStatus, setCallStatus] = React.useState<'connecting' | 'active' | 'ended'>('connecting');
  const [callTime, setCallTime] = React.useState(0);
  const [isMuted, setIsMuted] = React.useState(false);
  
  const [chatHistory, setChatHistory] = React.useState<Record<string, any[]>>({
    'D1': [
      { text: "Hi Staff, did we receive the latest ECG for Patient P-102?", sender: 'doctor', time: '10:05 AM' },
      { text: "Yes Doctor, it's already uploaded in the chart.", sender: 'me', time: '10:10 AM' }
    ]
  });

  const selectedDoctor = DOCTORS.find(d => d.id === selectedDoctorId);

  // Call Timer
  React.useEffect(() => {
    let interval: any;
    if (isCalling && callStatus === 'active') {
      interval = setInterval(() => {
        setCallTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCalling, callStatus]);

  const handleStartCall = () => {
    if (!selectedDoctor) return;
    setIsCalling(true);
    setCallStatus('connecting');
    setCallTime(0);
    
    // Simulate connection
    setTimeout(() => {
      setCallStatus('active');
    }, 2500);
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      setIsCalling(false);
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = () => {
    if (!message.trim() || !selectedDoctorId) return;
    
    const newMessage = {
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => ({
      ...prev,
      [selectedDoctorId]: [...(prev[selectedDoctorId] || []), newMessage]
    }));
    
    setMessage('');

    // Simulated auto-reply
    setTimeout(() => {
      const reply = {
        text: "Received. I will check the charts in a moment. Thank you.",
        sender: 'doctor',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => ({
        ...prev,
        [selectedDoctorId]: [...(prev[selectedDoctorId] || []), reply]
      }));
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto h-[80vh] bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex">
      {/* Sidebar: Doctors List */}
      <div className="w-80 border-r border-slate-50 flex flex-col">
        <div className="p-8 pb-4">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest mb-6">Medical Staff Chat</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search Doctors..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mb-2">Medical Staff Online</p>
          {DOCTORS.map(dr => (
            <button 
              key={dr.id}
              onClick={() => setSelectedDoctorId(dr.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-3xl transition-all group relative",
                selectedDoctorId === dr.id ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : "hover:bg-slate-50"
              )}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-brand-light/20 flex items-center justify-center rounded-2xl group-hover:bg-brand group-hover:text-white transition-colors">
                  <User size={20} />
                </div>
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px]",
                  dr.status === 'online' ? "bg-emerald-500" : dr.status === 'busy' ? "bg-amber-500" : "bg-slate-300"
                )}>
                </div>
              </div>
              <div className="text-left flex-1 min-w-0">
                <h4 className="text-[11px] font-black uppercase tracking-tight truncate">{dr.name}</h4>
                <p className={cn("text-[9px] font-medium uppercase tracking-widest", selectedDoctorId === dr.id ? "text-slate-400" : "text-slate-400")}>
                  {dr.specialty}
                </p>
              </div>
              {dr.unread && selectedDoctorId !== dr.id && (
                <div className="bg-brand text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {dr.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/30">
        {selectedDoctor ? (
          <>
            {/* Chat Header */}
            <div className="p-8 bg-white border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-800">
                  <User size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">{selectedDoctor.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", selectedDoctor.status === 'online' ? "bg-emerald-500" : "bg-amber-500")}></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{selectedDoctor.specialty} • {selectedDoctor.status === 'online' ? 'Available' : 'Busy'}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleStartCall}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all text-slate-600"
                >
                  <Phone size={20} />
                </button>
                <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all text-slate-400">
                  <AlertCircle size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="flex justify-center mb-8">
                <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-4 py-2 rounded-full uppercase tracking-widest">Encrypting clinical discussion...</span>
              </div>
              
              {(chatHistory[selectedDoctorId] || []).map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={cn("max-w-md", msg.sender === 'me' ? "ml-auto" : "")}
                >
                  <div className={cn(
                    "p-5 rounded-[2rem] shadow-sm",
                    msg.sender === 'me' ? "bg-slate-900 text-white rounded-br-none" : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"
                  )}>
                    <p className="text-xs font-medium leading-relaxed">{msg.text}</p>
                    <p className={cn("text-[9px] mt-2 font-black uppercase tracking-widest", msg.sender === 'me' ? "text-slate-500" : "text-slate-300 text-right")}>
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Calling Overlay */}
            <AnimatePresence>
              {isCalling && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[60] bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center text-white"
                >
                  <div className="flex flex-col items-center gap-8 mb-12">
                    <motion.div 
                      animate={callStatus === 'connecting' ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-32 h-32 bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-400 relative"
                    >
                      <User size={64} />
                      {callStatus === 'active' && (
                        <div className="absolute -top-2 -right-2 bg-emerald-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse">
                          Secure Link Active
                        </div>
                      )}
                    </motion.div>
                    <div className="text-center">
                      <h3 className="text-2xl font-black uppercase tracking-widest mb-1">{selectedDoctor.name}</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">{selectedDoctor.specialty}</p>
                      
                      {callStatus === 'connecting' ? (
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-xs font-bold text-brand animate-pulse">Requesting Physician Connection...</p>
                        </div>
                      ) : callStatus === 'active' ? (
                        <div className="space-y-1">
                          <p className="text-lg font-mono font-bold tracking-tighter text-emerald-400">{formatTime(callTime)}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Encrypted Voice Session</p>
                        </div>
                      ) : (
                        <p className="text-xs font-bold text-red-500">Session Terminated</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center transition-all",
                        isMuted ? "bg-white text-slate-900" : "bg-slate-800 text-white hover:bg-slate-700"
                      )}
                    >
                      {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                    <button 
                      onClick={handleEndCall}
                      className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-500/40 hover:scale-110 active:scale-95 transition-all"
                    >
                      <PhoneOff size={32} />
                    </button>
                    <button className="w-16 h-16 bg-slate-800 text-white rounded-full flex items-center justify-center hover:bg-slate-700 transition-all opacity-50 cursor-not-allowed">
                      <Clock size={24} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="p-8 pt-0">
              <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-4">
                <button className="p-4 text-slate-400 hover:text-brand transition-all">
                  <Paperclip size={20} />
                </button>
                <input 
                  type="text" 
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type a clinical message or referral..." 
                  className="flex-1 py-4 text-sm font-semibold outline-none"
                />
                <button 
                  onClick={handleSend}
                  className="bg-brand text-white p-4 rounded-2xl shadow-lg shadow-brand/30 hover:scale-[1.05] transition-all flex items-center gap-2 px-6"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">Send</span>
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
            <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center mb-6">
              <Send size={40} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">Physician Messaging Center</h3>
            <p className="text-xs font-medium text-slate-500 mt-2 max-w-xs leading-relaxed">Select a member of the medical staff to initiate a secure encrypted communication session for clinical coordination.</p>
          </div>
        )}
      </div>
    </div>
  );
};
