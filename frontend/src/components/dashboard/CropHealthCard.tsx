'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, ArrowRight, Droplets, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface CropHealthProps {
  id?: string;
  name: string;
  stage: string;
  progress: number;
  status: 'HEALTHY' | 'WARNING' | 'ATTENTION';
  water: string;
  diseaseRisk: 'LOW' | 'MODERATE' | 'HIGH';
  nextTask: string;
}

export const CropHealthCard: React.FC<CropHealthProps> = ({
  id = '1',
  name,
  stage,
  progress,
  status,
  water,
  diseaseRisk,
  nextTask,
}) => {
  const { t } = useLanguage();

  const getStatusBadge = () => {
    switch (status) {
      case 'HEALTHY':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            {t('health_healthy')}
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            {t('health_warning')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-950 text-red-300 border border-red-800">
            <ShieldAlert className="w-3 h-3 text-red-400" />
            {t('health_attention')}
          </span>
        );
    }
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800/80 bg-slate-900/70 hover:border-farm-500/50 transition-all duration-300 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-farm-950/80 border border-farm-800 flex items-center justify-center text-farm-300">
            <Sprout className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">{name}</h3>
            <p className="text-xs text-slate-400">{stage}</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Visual Growth Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="font-semibold text-slate-300">Growth Cycle</span>
          <span className="font-extrabold text-farm-300">{progress}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2.5 p-0.5 border border-slate-700/50">
          <div
            className="bg-gradient-to-r from-farm-500 via-emerald-400 to-emerald-300 h-1.5 rounded-full transition-all duration-500 shadow-sm shadow-emerald-400/50"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
        <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-center gap-2">
          <Droplets className="w-4 h-4 text-sky-400" />
          <div>
            <p className="text-[10px] text-slate-400">Water Level</p>
            <p className="font-bold text-slate-200">{water}</p>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <div>
            <p className="text-[10px] text-slate-400">Disease Risk</p>
            <p className="font-bold text-slate-200">{diseaseRisk}</p>
          </div>
        </div>
      </div>

      {/* Next Action Task */}
      <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/90 text-xs flex items-center justify-between gap-2">
        <div className="truncate">
          <p className="text-[10px] text-farm-400 font-bold uppercase tracking-wider">Next Task</p>
          <p className="font-semibold text-slate-200 truncate">{nextTask}</p>
        </div>
        <Link
          href={`/crops/${id}`}
          className="px-3 py-1.5 rounded-xl bg-farm-950 hover:bg-farm-900 border border-farm-800 text-farm-300 font-bold text-[11px] flex items-center gap-1 transition-all flex-shrink-0"
        >
          <span>{t('view_details')}</span>
        </Link>
      </div>
    </div>
  );
};
