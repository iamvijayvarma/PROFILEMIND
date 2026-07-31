import React from 'react';
import { motion } from 'framer-motion';
import { Home, Upload, MessageSquare, Compass, User } from 'lucide-react';
import { useAppState } from '../context/AppState';
import type { ScreenType } from '../context/AppState';

export const Navigation: React.FC = () => {
  const { currentPage, setCurrentPage, userProfile } = useAppState();

  // Define tab mappings
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'nova', label: 'Nova AI', icon: MessageSquare },
    { id: 'journey', label: 'Journey', icon: Compass },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Prevent rendering on initial landing stages
  if (['splash', 'landing', 'login', 'boot'].includes(currentPage)) {
    return null;
  }

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (Visible on md and larger viewports) */}
      <aside className="hidden md:flex flex-col w-64 bg-white/70 border-r border-slate-100 p-6 h-screen sticky top-0 shrink-0 z-40">
        {/* Logo Brand */}
        <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-extrabold text-sm shadow-md">
            PM
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
              ProfileMind
            </h1>
            <p className="text-[10px] text-brand-cyan font-bold tracking-widest uppercase">Identity Synthesizer</p>
          </div>
        </div>

        {/* Navigation Tabs List */}
        <nav className="flex-1 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentPage === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentPage(tab.id as ScreenType)}
                className={`relative flex items-center gap-4 w-full px-4 py-3 rounded-2xl text-left text-sm font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'text-brand-blue' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'
                }`}
              >
                {/* Active Glider Background */}
                {isActive && (
                  <motion.div
                    layoutId="desktopNavGlider"
                    className="absolute inset-0 bg-slate-50 border border-slate-100 rounded-2xl -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`} />
                <span>{tab.label}</span>

                {tab.id === 'nova' && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Metadata */}
        <div 
          onClick={() => setCurrentPage('profile')}
          className="mt-auto border-t border-slate-100/60 pt-4 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.fullName}
            className="w-8 h-8 rounded-full object-cover border border-slate-100 shrink-0"
          />
          <div className="truncate min-w-0">
            <h4 className="text-xs font-bold text-slate-800 truncate">{userProfile.fullName}</h4>
            <p className="text-[10px] text-slate-400 font-semibold truncate">{userProfile.email}</p>
          </div>
        </div>
      </aside>

      {/* 2. MOBILE BOTTOM NAVIGATION (Visible on mobile screens) */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 h-16 bg-white/95 border border-slate-100 rounded-[33px] shadow-[0_15px_30px_rgba(0,0,0,0.04),0_0_1px_rgba(0,0,0,0.1)] flex items-center justify-around px-4 z-40">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPage === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentPage(tab.id as ScreenType)}
              className="relative flex flex-col items-center justify-center w-12 h-12 text-slate-400 focus:outline-none"
            >
              {/* Active Indicator Circular Bubble */}
              {isActive && (
                <motion.div
                  layoutId="mobileNavGlider"
                  className="absolute inset-1 bg-slate-50 border border-slate-100 rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}

              <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-brand-blue scale-110' : 'text-slate-400 hover:text-slate-600'}`} />
              
              {/* Tab dot indicator */}
              {isActive && (
                <motion.div 
                  layoutId="navTabDot"
                  className="w-1 h-1 rounded-full bg-brand-blue mt-1"
                />
              )}

              {tab.id === 'nova' && !isActive && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
