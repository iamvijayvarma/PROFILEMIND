import React from 'react';
import { motion } from 'framer-motion';

export const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative bg-white">
      {/* Laser Scan line effect overlay */}
      <motion.div 
        className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-brand-cyan to-transparent shadow-[0_0_12px_rgba(6,182,212,0.6)]"
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />

      <div className="flex flex-col items-center gap-6 z-10 max-w-sm px-6 text-center">
        {/* Animated Pulsating Core Logo */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Ambient Glow Aura */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-brand-blue via-brand-cyan to-brand-purple opacity-30 rounded-full blur-xl"
            animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          />

          {/* Glowing Orb ring */}
          <motion.div
            className="absolute inset-3 border border-slate-100 rounded-full shadow-[inset_0_0_15px_rgba(139,92,246,0.1),0_0_15px_rgba(6,182,212,0.15)]"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          />

          {/* Logo symbol */}
          <motion.div
            className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shadow-brand-blue/15"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            PM
          </motion.div>
        </div>

        {/* Text Details */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-4"
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            ProfileMind
          </h1>
          <div className="space-y-1.5 px-4">
            <p className="text-sm font-semibold text-slate-500 leading-relaxed">
              "We don't store your files.
            </p>
            <p className="text-sm font-semibold text-slate-500 leading-relaxed">
              We remember your journey."
            </p>
          </div>
        </motion.div>

        {/* Custom Progress Indication */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-8 flex flex-col items-center gap-2"
        >
          <div className="flex gap-1.5 justify-center items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-ping" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Initializing AI Engine
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
