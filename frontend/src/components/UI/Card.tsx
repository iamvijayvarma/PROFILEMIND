import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = false, onClick }) => {
  const cardStyle = `bg-white border border-slate-100/80 rounded-3xl p-6 shadow-premium transition-colors duration-300 ${
    onClick ? 'cursor-pointer' : ''
  } ${className}`;

  if (hoverEffect || onClick) {
    return (
      <motion.div
        whileHover={{ 
          y: -4, 
          boxShadow: '0 30px 60px -25px rgba(0, 0, 0, 0.08), 0 0 60px rgba(139, 92, 246, 0.04)',
          borderColor: 'rgba(59, 130, 246, 0.15)'
        }}
        whileTap={onClick ? { scale: 0.98 } : undefined}
        onClick={onClick}
        className={cardStyle}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardStyle}>
      {children}
    </div>
  );
};
