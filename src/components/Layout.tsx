import React from 'react';
import { useAppState } from '../context/AppState';
import { Navigation } from './Navigation';
import { Toast } from './Toast';
import { AccountMenu } from './AccountMenu';
import { EditProfileModal } from './EditProfileModal';
import { LogoutModal } from './LogoutModal';
import { AvatarLightbox } from './AvatarLightbox';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentPage, setCurrentPage } = useAppState();

  // Standalone splash/landing flows
  const isLandingFlow = ['splash', 'landing', 'login', 'boot'].includes(currentPage);

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-white overflow-hidden">
      {/* Universal Aurora Backdrop */}
      <div className="aurora-container">
        <div className="aurora-blob blob-blue" />
        <div className="aurora-blob blob-cyan" />
        <div className="aurora-blob blob-violet" />
      </div>

      {/* Main Core Shell */}
      <div className="relative flex flex-1 w-full z-10">
        <Navigation />

        <div className="flex-1 flex flex-col w-full min-w-0">
          {/* Top Header Bar with Account Menu (on authenticated screens) */}
          {!isLandingFlow && (
            <header className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-2 flex justify-between items-center z-30 shrink-0">
              <div 
                className="flex items-center gap-2 cursor-pointer md:hidden"
                onClick={() => setCurrentPage('home')}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                  PM
                </div>
                <span className="font-extrabold text-sm tracking-tight text-slate-800">ProfileMind</span>
              </div>

              <div className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-widest">
                Decentralized Identity Platform
              </div>

              {/* Top-Right Dropdown Account Menu */}
              <AccountMenu />
            </header>
          )}

          <main className={`flex-1 flex flex-col relative w-full ${
            isLandingFlow 
              ? 'p-0' 
              : 'px-4 pt-2 pb-28 md:px-8 md:pb-8 max-w-7xl mx-auto overflow-y-auto no-scrollbar'
          }`}>
            {children}
          </main>
        </div>
      </div>

      {/* Floating Notifications & Modals */}
      <Toast />
      <EditProfileModal />
      <LogoutModal />
      <AvatarLightbox />
    </div>
  );
};
