import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { useAppState } from '../context/AppState';

export const AvatarLightbox: React.FC = () => {
  const { userProfile, isAvatarLightboxOpen, setIsAvatarLightboxOpen, addToast } = useAppState();

  if (!isAvatarLightboxOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        {/* Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAvatarLightboxOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Content Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative z-10 max-w-lg w-full flex flex-col items-center gap-4"
        >
          {/* Action header bar */}
          <div className="w-full flex justify-between items-center text-white px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Avatar Lightbox</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => addToast('Avatar downloaded to local memory', 'info')}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <Download className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => setIsAvatarLightboxOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Full High-Res Avatar Preview */}
          <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-black">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.fullName}
              className="w-full h-full object-cover"
            />
          </div>

          <span className="text-sm font-bold text-white tracking-tight">{userProfile.fullName}</span>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
