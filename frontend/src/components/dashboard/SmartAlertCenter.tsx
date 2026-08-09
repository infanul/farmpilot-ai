'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Bell, Info, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export interface SmartAlert {
  id: string;
  category: 'CRITICAL' | 'IMPORTANT' | 'ATTENTION' | 'INFO';
  title: string;
  message: string;
  actionText: string;
  actionUrl: string;
}

const DEMO_SMART_ALERTS: SmartAlert[] = [
  {
    id: 'alert-1',
    category: 'IMPORTANT',
    title: 'High Humidity Blight Warning',
    message: 'Ambient relative humidity is 88%. Inspect tomato leaves for early blight spots.',
    actionText: 'Scan Leaf Image',
    actionUrl: '/disease-scanner',
  },
  {
    id: 'alert-2',
    category: 'CRITICAL',
    title: 'Postpone Fertilizer Spraying',
    message: '65% rainfall probability predicted for afternoon. Delay foliar nutrient application.',
    actionText: 'Check Weather',
    actionUrl: '/weather',
  },
  {
    id: 'alert-3',
    category: 'ATTENTION',
    title: 'Potash Fertigation Due Today',
    message: 'Rice panicle initiation stage requires MOP top-dressing application.',
    actionText: 'View Task',
    actionUrl: '/calendar',
  },
];

export const SmartAlertCenter: React.FC = () => {
  const getCategoryBadge = (category: SmartAlert['category']) => {
    switch (category) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-950 text-red-300 border border-red-800 flex items-center gap-1">
            🔴 Critical Alert
          </span>
        );
      case 'IMPORTANT':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
            🟠 Important
          </span>
        );
      case 'ATTENTION':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-yellow-950 text-yellow-300 border border-yellow-800 flex items-center gap-1">
            🟡 Attention
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
            🟢 Information
          </span>
        );
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            Smart Alert Center & Actionable Advisories
          </h3>
          <p className="text-xs text-slate-400">Weather warnings, disease risk monitors, and urgent field task triggers</p>
        </div>
        <span className="text-xs font-bold text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          3 Active Alerts
        </span>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {DEMO_SMART_ALERTS.map((alert) => (
          <div
            key={alert.id}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {getCategoryBadge(alert.category)}
                <h4 className="text-xs font-extrabold text-white">{alert.title}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>
            </div>

            <Link
              href={alert.actionUrl}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-farm-600 to-emerald-600 hover:from-farm-500 hover:to-emerald-500 shadow-md flex items-center gap-1.5 transition-all flex-shrink-0"
            >
              <span>{alert.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
