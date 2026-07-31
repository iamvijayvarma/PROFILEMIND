import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Upload, MessageSquare, Compass, User, FileText, ArrowRight, Activity } from 'lucide-react';
import { useAppState } from '../context/AppState';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';

export const HomePage: React.FC = () => {
  const { userProfile, documents, setCurrentPage, addToast } = useAppState();
  const [quickQuery, setQuickQuery] = useState('');

  // Determine current hour greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleQuickAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery) return;
    
    // Redirect to Nova with query loaded
    setCurrentPage('nova');
    addToast('Transferring query to Nova AI...', 'info');
  };

  const completedDocs = documents.filter(d => d.status === 'done');

  return (
    <div className="space-y-8 w-full">
      
      {/* Dynamic Welcome Greeting */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-50 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {getGreeting()}, {userProfile.fullName}
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Your decentralized digital memory graph is updated and secure.
          </p>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-100/50">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
            Identity Synchronized
          </span>
        </div>
      </header>

      {/* Responsive Grid System (Intelligent Adaptive Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN - Primary Dashboard Metrics & Feed (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Profile Health overview card */}
          <Card className="relative overflow-hidden bg-gradient-to-tr from-slate-50 to-white">
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-brand-cyan/5 via-brand-purple/5 to-transparent blur-xl" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-md">
                <div className="inline-flex items-center gap-1.5 text-brand-blue">
                  <Activity className="w-4.5 h-4.5 text-brand-blue" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Synthesis Coherence</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800">Your Identity Score is Strong</h3>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  We've successfully compiled credentials across academic, technical, and professional baselines. Sync drift is currently <strong className="text-slate-700">1.2 hours</strong>.
                </p>
              </div>

              {/* Progress Ring Graphic */}
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="44" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                  <motion.circle 
                    cx="56" 
                    cy="56" 
                    r="44" 
                    stroke="url(#progressGradient)" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={276}
                    initial={{ strokeDashoffset: 276 }}
                    animate={{ strokeDashoffset: 276 * 0.15 }} // 85% full
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xl font-extrabold text-slate-800">85%</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Coherent</span>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Summary Card */}
          <Card hoverEffect className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-purple" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">AI Persona Summary</h4>
              </div>
              <span className="text-[10px] font-bold text-brand-purple uppercase bg-purple-50 px-2.5 py-1 rounded-lg">Nova Evaluated</span>
            </div>
            
            <p className="text-sm font-semibold text-slate-600 leading-relaxed">
              "Linguistically exhibits builder-centric profiles, focusing strongly on interface construction, state engines, and front-end architectures. Commits display methodical progress, with performance ratings scaling highest in autonomous workspaces."
            </p>
          </Card>

          {/* Recent memory uploads */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Footprint Artifacts</h4>
              <button 
                onClick={() => setCurrentPage('journey')}
                className="text-xs font-bold text-brand-blue hover:text-blue-700 transition-colors flex items-center gap-1"
              >
                Full Timeline <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {completedDocs.length === 0 ? (
                <Card className="text-center py-10 space-y-3">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-400 font-semibold">No digital baseline credentials uploaded yet.</p>
                  <Button variant="secondary" className="max-w-xs mx-auto" onClick={() => setCurrentPage('upload')}>
                    Upload credentials
                  </Button>
                </Card>
              ) : (
                completedDocs.slice(0, 3).map((doc) => (
                  <Card key={doc.id} hoverEffect className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="p-2.5 bg-blue-50 border border-blue-100/50 rounded-xl text-brand-blue shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-slate-800 truncate">{doc.name}</h5>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Confidence: {doc.confidence}% • Mapped {doc.date}</p>
                      </div>
                    </div>

                    <div className="hidden sm:flex gap-1.5 max-w-xs overflow-hidden">
                      {doc.skills.slice(0, 2).map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-500 whitespace-nowrap">
                          {s}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - Assistant Quick actions & sidebar widgets (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Nova AI chat query assistant card */}
          <Card className="bg-gradient-to-b from-brand-blue/5 via-transparent to-transparent border-slate-100">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-blue" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Nova Assistant</h4>
              </div>
              <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                Query your synthesized profile or ask what credentials you are missing.
              </p>
              
              <form onSubmit={handleQuickAsk} className="space-y-3">
                <textarea
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder="e.g. Map my career strengths..."
                  rows={2}
                  className="w-full p-3.5 bg-white border border-slate-100 rounded-2xl text-xs placeholder-slate-400 outline-none resize-none focus:border-brand-blue/40 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.06)] transition-all"
                />
                <Button type="submit" size="sm">
                  Consult Nova
                </Button>
              </form>
            </div>
          </Card>

          {/* Quick Actions Shortcuts Grid */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Workspace Actions</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setCurrentPage('upload')}
                className="flex flex-col items-center justify-center p-5 bg-white border border-slate-100 rounded-3xl text-slate-500 hover:text-brand-blue hover:border-brand-blue/20 hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300"
              >
                <Upload className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold">Upload Center</span>
              </button>

              <button 
                onClick={() => setCurrentPage('nova')}
                className="flex flex-col items-center justify-center p-5 bg-white border border-slate-100 rounded-3xl text-slate-500 hover:text-brand-purple hover:border-brand-purple/20 hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300"
              >
                <MessageSquare className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold">Nova Chat</span>
              </button>

              <button 
                onClick={() => setCurrentPage('journey')}
                className="flex flex-col items-center justify-center p-5 bg-white border border-slate-100 rounded-3xl text-slate-500 hover:text-brand-cyan hover:border-brand-cyan/20 hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300"
              >
                <Compass className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold">Journey Timeline</span>
              </button>

              <button 
                onClick={() => setCurrentPage('profile')}
                className="flex flex-col items-center justify-center p-5 bg-white border border-slate-100 rounded-3xl text-slate-500 hover:text-brand-blue hover:border-brand-blue/20 hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300"
              >
                <User className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold">My Profile</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
