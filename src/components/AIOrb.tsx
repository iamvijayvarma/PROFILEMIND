import React from 'react';
import { motion } from 'framer-motion';

interface AIOrbProps {
  size?: 'sm' | 'md' | 'lg';
  state?: 'idle' | 'listening' | 'thinking';
  onClick?: () => void;
}

export const AIOrb: React.FC<AIOrbProps> = ({ size = 'md', state = 'idle', onClick }) => {
  // Map sizing classes
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  };

  // Map state to animation speeds & scale variants
  const pulseScale = state === 'listening' ? [1, 1.12, 1] : state === 'thinking' ? [1, 1.05, 1] : [1, 1.03, 1];
  const pulseDuration = state === 'listening' ? 1.5 : state === 'thinking' ? 1.0 : 3.0;

  return (
    <div 
      className={`relative cursor-pointer flex items-center justify-center ${sizeClasses[size]}`}
      onClick={onClick}
    >
      {/* Dynamic Ambient Blur Glows (Aurora effects around the Orb) */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-blue via-brand-cyan to-brand-purple opacity-40 blur-xl"
        animate={{
          scale: pulseScale,
          rotate: [0, 120, 240, 360],
        }}
        transition={{
          scale: { repeat: Infinity, duration: pulseDuration, ease: "easeInOut" },
          rotate: { repeat: Infinity, duration: 15, ease: "linear" }
        }}
      />
      
      {/* Outer Rotating Segment Core 1 (Cyan/Blue) */}
      <motion.div
        className="absolute inset-2 rounded-[40%_60%_60%_40%_/_40%_60%_40%_60%] bg-gradient-to-br from-brand-cyan/70 to-brand-blue/70 mix-blend-multiply opacity-80"
        animate={{
          borderRadius: [
            "40% 60% 60% 40% / 40% 60% 40% 60%",
            "60% 40% 40% 60% / 60% 40% 60% 40%",
            "40% 60% 60% 40% / 40% 60% 40% 60%"
          ],
          rotate: [0, 180, 360],
          scale: state === 'listening' ? 1.05 : 1
        }}
        transition={{
          borderRadius: { repeat: Infinity, duration: 6, ease: "easeInOut" },
          rotate: { repeat: Infinity, duration: 10, ease: "linear" },
          scale: { duration: 0.3 }
        }}
      />

      {/* Outer Rotating Segment Core 2 (Purple/Blue) */}
      <motion.div
        className="absolute inset-3 rounded-[60%_40%_50%_50%_/_50%_50%_40%_60%] bg-gradient-to-tr from-brand-purple/70 to-brand-blue/60 mix-blend-multiply opacity-80"
        animate={{
          borderRadius: [
            "60% 40% 50% 50% / 50% 50% 40% 60%",
            "40% 60% 60% 40% / 40% 50% 60% 40%",
            "60% 40% 50% 50% / 50% 50% 40% 60%"
          ],
          rotate: [360, 180, 0],
          scale: state === 'listening' ? 1.08 : 1
        }}
        transition={{
          borderRadius: { repeat: Infinity, duration: 5, ease: "easeInOut" },
          rotate: { repeat: Infinity, duration: 8, ease: "linear" },
          scale: { duration: 0.3 }
        }}
      />

      {/* Dynamic Core Orb (Solid center with white intelligence glow) */}
      <motion.div
        className="absolute inset-8 rounded-full bg-white flex items-center justify-center shadow-lg"
        animate={{
          scale: state === 'listening' ? [0.95, 1.08, 0.95] : [0.98, 1.02, 0.98],
        }}
        transition={{
          repeat: Infinity,
          duration: state === 'listening' ? 1.2 : 2.5,
          ease: "easeInOut"
        }}
      >
        {/* Subtle interior gradient glow */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-brand-cyan/10 via-brand-blue/5 to-brand-purple/20 blur-[1px]" />
        
        {/* Pulsing White Core Light */}
        <motion.div 
          className="w-4 h-4 rounded-full bg-white shadow-[0_0_15px_#ffffff]"
          animate={{
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            repeat: Infinity,
            duration: state === 'listening' ? 0.8 : 2.0,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
};
