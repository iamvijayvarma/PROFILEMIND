import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader } from 'lucide-react';
import { useAppState } from '../context/AppState';
import { AIOrb } from '../components/AIOrb';

export const AIBootScreen: React.FC = () => {
  const { setCurrentPage, addToast } = useAppState();
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    'Reading Profile Baseline',
    'Loading Mapped Memories',
    'Connecting Skill Matrix',
    'Building Growth Timeline',
    'Preparing Nova Dialogue'
  ];

  useEffect(() => {
    if (activeStep < steps.length) {
      const stepTimer = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, activeStep]);
        setActiveStep((prev) => prev + 1);
      }, 1200); // 1.2s per boot milestone

      return () => clearTimeout(stepTimer);
    } else {
      // All steps completed - redirect to home page
      const redirectTimer = setTimeout(() => {
        addToast('Baseline Identity Synchronized Successfully!', 'success');
        setCurrentPage('home');
      }, 800);
      return () => clearTimeout(redirectTimer);
    }
  }, [activeStep]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative bg-white px-6">
      
      <div className="max-w-md w-full flex flex-col items-center gap-8 z-10">
        {/* Glowing Spinning Orb Core */}
        <AIOrb size="md" state="thinking" />

        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Synthesizing Digital Identity</h2>
          <p className="text-xs font-semibold text-slate-400">Compiling unified footprint records...</p>
        </div>

        {/* Stepper Checks List */}
        <div className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-premium space-y-4">
          {steps.map((step, idx) => {
            const isCompleted = completedSteps.includes(idx);
            const isActive = activeStep === idx;
            
            return (
              <div 
                key={idx}
                className={`flex items-center gap-3.5 transition-all duration-300 ${
                  isCompleted 
                    ? 'text-slate-800 font-semibold' 
                    : isActive 
                      ? 'text-brand-blue font-bold scale-[1.01]' 
                      : 'text-slate-300'
                }`}
              >
                {/* Checking visual indicator */}
                <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </motion.div>
                    ) : isActive ? (
                      <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-brand-blue animate-spin"
                      >
                        <Loader className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="dot"
                        className="w-2.5 h-2.5 rounded-full bg-slate-200"
                      />
                    )}
                  </AnimatePresence>
                </div>

                <span className="text-xs tracking-wide">{step}</span>
              </div>
            );
          })}
        </div>

        {/* Stepper Progress bar */}
        <div className="w-full space-y-2 mt-2">
          <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
            <motion.div 
              className="h-full bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-purple"
              initial={{ width: '0%' }}
              animate={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
      
    </div>
  );
};
