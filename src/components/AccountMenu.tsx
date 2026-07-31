import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Edit3, 
  Settings, 
  Palette, 
  Bell, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';
import { useAppState } from '../context/AppState';

export const AccountMenu: React.FC = () => {
  const { 
    userProfile, 
    setCurrentPage, 
    setIsEditProfileOpen, 
    setIsLogoutOpen, 
    addToast 
  } = useAppState();
  
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside auto-close handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  const menuItems = [
    {
      label: 'My Profile',
      icon: User,
      action: () => setCurrentPage('profile')
    },
    {
      label: 'Edit Profile',
      icon: Edit3,
      action: () => setIsEditProfileOpen(true)
    },
    {
      label: 'Account Settings',
      icon: Settings,
      action: () => addToast('Opening Account Settings...', 'info')
    },
    {
      label: 'Appearance',
      icon: Palette,
      action: () => addToast('Appearance: Aurora Light UI Active', 'info')
    },
    {
      label: 'Notification Settings',
      icon: Bell,
      action: () => addToast('Opening Notification Preferences...', 'info')
    },
    {
      label: 'Privacy & Security',
      icon: ShieldCheck,
      action: () => addToast('Homomorphic Key Security Active', 'info')
    },
    {
      label: 'Help & Support',
      icon: HelpCircle,
      action: () => addToast('Opening Help & Support Center...', 'info')
    },
    {
      label: 'Terms & Privacy',
      icon: FileText,
      action: () => addToast('Opening Terms & Privacy Policy...', 'info')
    },
    {
      label: 'Logout',
      icon: LogOut,
      danger: true,
      action: () => setIsLogoutOpen(true)
    }
  ];

  return (
    <div className="relative inline-block text-left z-50" ref={menuRef}>
      {/* Account Menu Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pl-3 rounded-2xl bg-white/80 border border-slate-100 hover:bg-slate-50 shadow-sm transition-all duration-300 focus:outline-none"
      >
        <span className="text-xs font-bold text-slate-700 hidden sm:inline-block max-w-[110px] truncate">
          {userProfile.fullName}
        </span>

        <div className="relative w-8 h-8 rounded-full">
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.fullName}
            className="w-full h-full rounded-full object-cover border border-slate-100"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-64 rounded-3xl bg-white border border-slate-100/80 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08),0_0_1px_rgba(0,0,0,0.1)] p-2 z-50"
          >
            {/* Header info */}
            <div className="p-3 border-b border-slate-50 mb-1">
              <p className="text-xs font-bold text-slate-800 truncate">{userProfile.fullName}</p>
              <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{userProfile.email}</p>
            </div>

            {/* Menu options list */}
            <div className="space-y-0.5 max-h-[340px] overflow-y-auto no-scrollbar">
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                const isDanger = item.danger;

                return (
                  <button
                    key={idx}
                    onClick={() => handleAction(item.action)}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isDanger
                        ? 'text-red-500 hover:bg-red-50/60'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isDanger ? 'text-red-500' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
