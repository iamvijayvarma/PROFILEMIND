import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useAppState } from '../context/AppState';

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useAppState();

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-brand-blue shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-100/50 bg-white/95',
    info: 'border-blue-100/50 bg-white/95',
    error: 'border-red-100/50 bg-white/95'
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 flex flex-col gap-3 z-[9999] w-full max-w-[340px] md:max-w-md px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }}
            layout
            className={`flex items-center gap-3 p-4 rounded-2xl border shadow-[0_15px_30px_rgba(0,0,0,0.06),0_0_1px_rgba(0,0,0,0.08)] ${borders[toast.type]}`}
          >
            {icons[toast.type]}
            <p className="text-xs font-semibold text-slate-800 flex-1 leading-relaxed">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
