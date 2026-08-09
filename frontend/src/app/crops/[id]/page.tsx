'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '../../../components/layout/Sidebar';
import { apiClient } from '../../../lib/apiClient';
import { Crop } from '../../../types';
import {
  Sprout,
  Thermometer,
  Droplets,
  Layers,
  ShieldAlert,
  Calendar,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Check,
} from 'lucide-react';

export default function CropDetailPage() {
  const params = useParams();
  const cropId = params?.id as string;

  const [crop, setCrop] = useState<Crop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cropId) {
      apiClient
        .get<Crop>(`/crops/${cropId}`)
        .then(setCrop)
        .catch((err) => console.error('Failed to load crop detail:', err))
        .finally(() => setLoading(false));
    }
  }, [cropId]);

  if (loading) {
    return (
      <div className="flex max-w-7xl mx-auto px-4 py-6 gap-6">
        <Sidebar />
        <div className="flex-1 animate-pulse space-y-4">
          <div className="h-64 bg-slate-900 rounded-3xl"></div>
          <div className="h-40 bg-slate-900 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="flex max-w-7xl mx-auto px-4 py-6 gap-6">
        <Sidebar />
        <div className="flex-1 text-center py-20">
          <p className="text-lg font-semibold text-slate-300">Crop not found.</p>
          <Link href="/crops" className="text-farm-400 hover:underline text-xs mt-2 inline-block">
            ← Back to Crops Catalog
          </Link>
        </div>
      </div>
    );
  }

  let growthStagesList: { stage: string; durationDays: number }[] = [];
  try {
    if (crop.growthStages) {
      growthStagesList = JSON.parse(crop.growthStages);
    }
  } catch (e) {
    growthStagesList = [];
  }

  return (
    <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      <Sidebar />

      <div className="flex-1 min-w-0 space-y-6">
        <Link href="/crops" className="inline-flex items-center gap-1.5 text-xs text-farm-400 hover:underline font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Crop Library
        </Link>

        {/* Hero Banner */}
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden bg-slate-900/90 shadow-2xl">
          <div className="h-64 relative">
            <img
              src={crop.imageUrl || 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&q=80&w=800'}
              alt={crop.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-6 sm:p-8">
              <div>
                <span className="bg-farm-950/90 text-farm-300 text-xs font-bold px-3 py-1 rounded-full border border-farm-700">
                  {crop.cropType}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">{crop.name}</h1>
                <p className="text-sm italic text-slate-300">{crop.scientificName}</p>
              </div>
            </div>
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-900/60 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-semibold">Temperature</p>
                <p className="text-xs font-bold text-slate-100">{crop.tempMin}°C - {crop.tempMax}°C</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-semibold">Soil pH</p>
                <p className="text-xs font-bold text-slate-100">{crop.soilPhMin} - {crop.soilPhMax}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-semibold">Soil Type</p>
                <p className="text-xs font-bold text-slate-100">{crop.soilRequirements.split(' ')[0]} Soil</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-semibold">Season</p>
                <p className="text-xs font-bold text-slate-100">{crop.growingSeason}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Growing Guide Timeline */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sprout className="w-5 h-5 text-farm-400" />
            Agronomic Growth Stages Timeline
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
            {growthStagesList.map((stg, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 relative">
                <div className="w-6 h-6 rounded-full bg-farm-600 text-white font-bold text-xs flex items-center justify-center mb-2">
                  {idx + 1}
                </div>
                <p className="text-xs font-bold text-slate-100">{stg.stage}</p>
                <p className="text-[10px] text-farm-400 font-medium">Duration: ~{stg.durationDays} Days</p>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Breakdown: Irrigation & Fertilizer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              Irrigation Management
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              {crop.irrigationGuidance}
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400" />
              Fertilization Schedule
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              {crop.fertilizationSchedule}
            </p>
          </div>
        </div>

        {/* Diseases Registered */}
        {crop.diseases && crop.diseases.length > 0 && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              Common Diseases & IPM Prevention
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {crop.diseases.map((dis) => (
                <div key={dis.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{dis.name}</h4>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-red-950 text-red-400 border border-red-800">
                      {dis.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed"><strong>Symptoms:</strong> {dis.symptoms}</p>
                  <p className="text-xs text-slate-400 leading-relaxed"><strong>Prevention:</strong> {dis.prevention}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Harvesting & Storage */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            Harvesting & Storage Guidance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="font-bold text-slate-100">🌾 Harvesting:</span>
              <p className="leading-relaxed">{crop.harvestingGuidance}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="font-bold text-slate-100">📦 Storage:</span>
              <p className="leading-relaxed">{crop.storageGuidance}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
