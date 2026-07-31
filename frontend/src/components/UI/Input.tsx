import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconRight?: React.ReactNode;
  onIconRightClick?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  iconRight,
  onIconRightClick,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          className={`w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 text-sm placeholder-slate-400 outline-none transition-all duration-300 focus:border-brand-purple/40 focus:bg-white focus:shadow-[0_0_0_4px_rgba(139,92,246,0.06),0_10px_20px_-10px_rgba(0,0,0,0.03)] ${
            error ? 'border-red-400 focus:border-red-400' : ''
          } ${iconRight ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {iconRight && (
          <button
            type="button"
            onClick={onIconRightClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
          >
            {iconRight}
          </button>
        )}
      </div>
      {error && (
        <span className="text-xs text-red-500 pl-1 mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
};
