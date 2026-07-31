import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  form?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  form,
  disabled = false,
  loading = false,
  className = '',
  icon
}) => {
  const baseStyle = "flex items-center justify-center gap-2 font-bold transition-all duration-300 focus:outline-none w-full";
  
  const sizes = {
    sm: "px-4 py-2.5 text-xs rounded-xl",
    md: "px-6 py-3.5 text-sm rounded-2xl",
    lg: "px-8 py-4 text-base rounded-3xl"
  };

  const variants = {
    primary: "bg-gradient-to-tr from-brand-blue to-brand-purple text-white shadow-[0_8px_24px_-6px_rgba(139,92,246,0.3)] hover:shadow-[0_12px_28px_-4px_rgba(139,92,246,0.45)] hover:scale-[1.01]",
    secondary: "bg-white border border-slate-100 text-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:bg-slate-50 hover:border-slate-200",
    ghost: "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      type={type}
      form={form}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </motion.button>
  );
};
