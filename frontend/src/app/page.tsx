'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '../components/ui/Logo';
import {
  Sprout,
  Scan,
  CloudSun,
  TestTube,
  Calendar,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function LandingPage() {
  const supportedCrops = [
    {
      name: 'Rice (Oryza sativa)',
      type: 'Cereal Grain',
      image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&q=80&w=800',
      description: 'Comprehensive guides for land puddling, nursery sowing, tillering water management, and Blast disease prevention.',
    },
    {
      name: 'Tomato (Solanum lycopersicum)',
      type: 'Horticultural Crop',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
      description: 'Pro-tray nursery care, drip fertigation schedules, bamboo trellising, and Early/Late Blight scanning.',
    },
    {
      name: 'Coconut (Cocos nucifera)',
      type: 'Perennial Plantation',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800',
      description: 'Year-round palm nutrition, basin irrigation, pre-monsoon crown sanitation, and Bud Rot prevention.',
    },
  ];

  const features = [
    {
      icon: CloudSun,
      title: '1. Live Weather Intelligence',
      desc: 'Real-time temperature, humidity, wind, and rain probability forecasts with dynamic farming alerts.',
    },
    {
      icon: Scan,
      title: '2. AI Disease Scanner',
      desc: 'Upload crop leaf photos for instant disease identification, symptoms analysis, and safe IPM treatment.',
    },
    {
      icon: Calendar,
      title: '3. Smart Crop Calendar',
      desc: 'Planting date-driven task schedules that dynamically postpone tasks when rain or high heat occurs.',
    },
    {
      icon: TestTube,
      title: '4. Soil Intelligence',
      desc: 'Visual soil health score gauge (0-100), N-P-K nutrient monitoring, and custom organic recommendations.',
    },
    {
      icon: TrendingUp,
      title: '5. Market Intelligence',
      desc: 'Track regional crop prices and view 7-day and 30-day price trend analytics with Recharts.',
    },
    {
      icon: Zap,
      title: '6. Farming Advisor',
      desc: 'Instant practical advisory Q&A for yellowing leaves, heavy rain prep, and seasonal crop care.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Dynamic Farming Aerial Background Visual */}
      <div className="absolute inset-0 z-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center filter saturate-150 blur-[2px]" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-farm-950/90 border border-farm-700/60 text-farm-300 text-xs font-semibold mb-6 shadow-lg shadow-farm-950/50">
          <Sprout className="w-4 h-4 text-farm-400 animate-pulse" />
          <span>Smarter Decisions. Healthier Crops. Better Harvests.</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Farm smarter with <span className="text-transparent bg-clip-text bg-gradient-to-r from-farm-400 via-emerald-300 to-green-500">FarmPilot AI</span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Weather, soil, crop health, disease detection, market intelligence and crop planning — all in one intelligent digital farming assistant designed for real farmers.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-farm-600 via-farm-500 to-emerald-600 hover:from-farm-500 hover:to-emerald-500 shadow-xl shadow-farm-900/50 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all hover:scale-105"
          >
            Explore FarmPilot AI Demo
          </Link>
        </div>
      </div>

      {/* Feature Showcase Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Complete Digital Farming Platform</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">Everything a farmer needs to manage crops, soil, weather, and market sales.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-farm-600/50 transition-all hover:-translate-y-1 shadow-lg"
              >
                <div className="p-3 w-12 h-12 rounded-xl bg-farm-900/50 border border-farm-700/50 text-farm-400 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supported Crops Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-farm-400 bg-farm-950 px-3 py-1 rounded-full border border-farm-800">
            Initial Crop Database
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">Fully Supported Crop Catalogs</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">Complete agronomic schedules, disease database, and growth timelines.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supportedCrops.map((crop, idx) => (
            <div key={idx} className="glass-panel rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/80 shadow-xl group">
              <div className="h-48 relative overflow-hidden">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 text-farm-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-farm-700">
                  {crop.type}
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="text-lg font-bold text-white">{crop.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{crop.description}</p>
                <Link
                  href="/crops"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-farm-400 hover:text-farm-300 mt-2"
                >
                  <span>View Full Growing Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="glass-panel p-10 rounded-3xl border border-farm-600/40 bg-gradient-to-r from-farm-950 via-slate-900 to-farm-900/50 shadow-2xl">
          <Logo size="lg" className="justify-center mb-4" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Ready to elevate your farm yield?</h2>
          <p className="text-xs sm:text-base text-slate-300 mt-3 max-w-xl mx-auto">
            Join FarmPilot AI today and make smarter farming decisions with real-time weather, disease scanning, and soil intelligence.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-farm-600 hover:bg-farm-500 shadow-lg shadow-farm-900/50 transition-all hover:scale-105"
            >
              Register Your Farm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
