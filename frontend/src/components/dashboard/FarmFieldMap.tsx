'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Droplets, ShieldAlert, CheckCircle2, ArrowRight, Sprout } from 'lucide-react';

export interface FieldItem {
  id: string;
  name: string;
  cropName: string;
  areaAcres: number;
  moisturePercent: number;
  healthStatus: 'HEALTHY' | 'MONITORING' | 'ATTENTION';
  irrigationStatus: string;
  alertNote?: string;
}

const DEMO_FIELDS: FieldItem[] = [
  {
    id: 'field-a',
    name: 'Sector A (North Paddy)',
    cropName: 'Rice (Jyothi Paddy)',
    areaAcres: 2.0,
    moisturePercent: 68,
    healthStatus: 'HEALTHY',
    irrigationStatus: 'Submerged 3 cm',
  },
  {
    id: 'field-b',
    name: 'Sector B (East Raised Bed)',
    cropName: 'Tomato (Arka Rakshak)',
    areaAcres: 1.5,
    moisturePercent: 52,
    healthStatus: 'MONITORING',
    irrigationStatus: 'Drip Active',
    alertNote: 'High humidity blight risk',
  },
  {
    id: 'field-c',
    name: 'Sector C (South Plot)',
    cropName: 'Chilli (Teja Variety)',
    areaAcres: 1.0,
    moisturePercent: 44,
    healthStatus: 'HEALTHY',
    irrigationStatus: 'Drip Scheduled Today',
  },
];

export const FarmFieldMap: React.FC = () => {
  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            Visual Farm Field Overview & Soil Moisture Status
          </h3>
          <p className="text-xs text-slate-400">Interactive plot status, crop health, and real-time irrigation monitoring</p>
        </div>
        <Link href="/farms" className="text-xs font-bold text-farm-400 hover:underline flex items-center gap-1">
          Manage Fields <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Field Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DEMO_FIELDS.map((field) => (
          <div
            key={field.id}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-farm-500/50 transition-all duration-300"
          >
            {/* Field Title & Health Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-farm-950 text-emerald-400 border border-farm-800">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{field.name}</h4>
                  <p className="text-[10px] text-slate-400">{field.areaAcres} Acres</p>
                </div>
              </div>
              {field.healthStatus === 'HEALTHY' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Healthy
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                  <ShieldAlert className="w-3 h-3 text-amber-400" /> Monitoring
                </span>
              )}
            </div>

            {/* Crop Name */}
            <p className="text-xs font-extrabold text-slate-200">{field.cropName}</p>

            {/* Soil Moisture Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" /> Moisture
                </span>
                <span className="font-bold text-sky-300">{field.moisturePercent}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-sky-500 to-emerald-400 h-2 rounded-full"
                  style={{ width: `${field.moisturePercent}%` }}
                />
              </div>
            </div>

            {/* Irrigation & Alert Note */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] space-y-1">
              <p className="text-slate-300 font-semibold">💧 {field.irrigationStatus}</p>
              {field.alertNote && (
                <p className="text-amber-400 text-[10px] font-medium flex items-center gap-1">
                  ⚠️ {field.alertNote}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
