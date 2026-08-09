'use client';

import React from 'react';

interface SoilHealthGaugeProps {
  score: number; // 0 to 100
  statusText?: string;
  size?: number;
}

export const SoilHealthGauge: React.FC<SoilHealthGaugeProps> = ({
  score,
  statusText = 'Healthy Soil',
  size = 180,
}) => {
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let scoreColor = '#22c55e'; // green
  if (score < 50) scoreColor = '#ef4444'; // red
  else if (score < 75) scoreColor = '#f59e0b'; // amber

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={scoreColor}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-white">{Math.round(score)}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">/ 100</span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <span
          className="text-xs font-bold px-3 py-1 rounded-full border"
          style={{
            borderColor: scoreColor,
            color: scoreColor,
            backgroundColor: `${scoreColor}15`,
          }}
        >
          {statusText}
        </span>
      </div>
    </div>
  );
};
