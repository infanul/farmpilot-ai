'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '../../components/layout/Sidebar';
import { apiClient } from '../../lib/apiClient';
import { Crop } from '../../types';
import { Sprout, ArrowRight, Thermometer, Droplets, ShieldAlert } from 'lucide-react';

export default function CropsPage() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<Crop[]>('/crops')
      .then(setCrops)
      .catch((err) => console.error('Failed to load crops:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      <Sidebar />

      <div className="flex-1 min-w-0 space-y-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-farm-950/60 shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-farm-400 bg-farm-950 px-3 py-1 rounded-full border border-farm-800">
            Agronomic Library
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">Supported Crop Library</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Complete growing guides, fertilizer schedules, water requirements, and disease prevention for Rice, Tomato, and Coconut.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            <div className="h-72 bg-slate-900 rounded-2xl"></div>
            <div className="h-72 bg-slate-900 rounded-2xl"></div>
            <div className="h-72 bg-slate-900 rounded-2xl"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {crops.map((crop) => (
              <div
                key={crop.id}
                className="glass-panel rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/80 shadow-xl hover:border-farm-600/60 transition-all hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={crop.imageUrl || 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&q=80&w=800'}
                      alt={crop.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/90 text-farm-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-farm-800">
                      {crop.cropType}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-xl font-bold text-white">{crop.name}</h3>
                      <p className="text-xs italic text-slate-400">{crop.scientificName}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                        <span>Temp: {crop.tempMin}°C - {crop.tempMax}°C</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplets className="w-3.5 h-3.5 text-blue-400" />
                        <span>pH: {crop.soilPhMin} - {crop.soilPhMax}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                        <span>{crop.diseases?.length || 3} Registered Diseases</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/crops/${crop.id}`}
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-farm-600 hover:bg-farm-500 flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <span>View Complete Growing Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
