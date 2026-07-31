import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useAppState } from '../context/AppState';
import { Button } from './UI/Button';

export const LogoutModal: React.FC = () => {
  const { isLogoutOpen, setIsLogoutOpen, logout } = useAppState();

  if (!isLogoutOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsLogoutOpen(false)}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Dialog card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative w-full max-w-sm bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl z-10 space-y-5 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-sm">
            <LogOut className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Sign Out?</h3>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              Are you sure you want to logout from ProfileMind?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setIsLogoutOpen(false)}
            >
              Cancel
            </Button>

            <button
              onClick={logout}
              className="w-full px-4 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm shadow-[0_8px_20px_rgba(239,68,68,0.3)] transition-all"
            >
              Logout
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
