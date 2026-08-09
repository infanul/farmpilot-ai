import React from 'react';
import { Sprout, Compass, Cpu } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex items-center justify-center p-2 rounded-xl bg-gradient-to-br from-farm-500 via-farm-600 to-emerald-800 text-white shadow-lg shadow-farm-900/40 group">
        <Sprout className={`${iconSizes[size]} transition-transform group-hover:scale-110`} />
        <Compass className="absolute -top-1 -right-1 w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <Cpu className="absolute -bottom-1 -left-1 w-3 h-3 text-emerald-200 opacity-80" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold tracking-tight text-white ${textSizes[size]}`}>
            FarmPilot <span className="text-farm-400 font-extrabold">AI</span>
          </span>
          <span className="text-[10px] text-slate-400 tracking-wider font-medium -mt-1 uppercase">
            Intelligent Farming Companion
          </span>
        </div>
      )}
    </div>
  );
};
