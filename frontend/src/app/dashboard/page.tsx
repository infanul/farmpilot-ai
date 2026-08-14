'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '../../components/layout/Sidebar';
import { WeatherWidget } from '../../components/dashboard/WeatherWidget';
import { FarmSummaryCards } from '../../components/dashboard/FarmSummaryCards';
import { AlertsBanner } from '../../components/dashboard/AlertsBanner';
import { QuickTasks } from '../../components/dashboard/QuickTasks';
import { SoilHealthGauge } from '../../components/soil/SoilHealthGauge';
import { CropHealthCard, CropHealthProps } from '../../components/dashboard/CropHealthCard';
import { CropGrowthTimeline } from '../../components/dashboard/CropGrowthTimeline';
import { FarmFieldMap } from '../../components/dashboard/FarmFieldMap';
import { SmartAlertCenter } from '../../components/dashboard/SmartAlertCenter';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiClient } from '../../lib/apiClient';
import { WeatherData, WeatherAlert, CropCalendarEvent, SoilRecord, MarketPrice, DiseaseScanResult } from '../../types';
import { ArrowRight, Leaf, TrendingUp, TestTube, Sparkles, Sprout, Scan } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [events, setEvents] = useState<CropCalendarEvent[]>([]);
  const [soilRecord, setSoilRecord] = useState<SoilRecord | null>(null);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [recentScans, setRecentScans] = useState<DiseaseScanResult[]>([]);
  const [loading, setLoading] = useState(true);

  const farmerName = user?.name ? user.name.split(' ')[0] : 'Farmer';

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [weatherRes, alertsRes, marketRes, soilRes] = await Promise.allSettled([
          apiClient.get<WeatherData>('/weather'),
          apiClient.get<WeatherAlert[]>('/weather/alerts'),
          apiClient.get<MarketPrice[]>('/market'),
          apiClient.get<SoilRecord[]>('/soil'),
        ]);

        if (weatherRes.status === 'fulfilled') setWeather(weatherRes.value);
        if (alertsRes.status === 'fulfilled') setAlerts(alertsRes.value);
        if (marketRes.status === 'fulfilled') setMarketPrices(marketRes.value);
        if (soilRes.status === 'fulfilled' && Array.isArray(soilRes.value) && soilRes.value.length > 0) {
          setSoilRecord(soilRes.value[0]);
        }

        try {
          const [calEvents, scans] = await Promise.all([
            apiClient.get<CropCalendarEvent[]>('/calendar'),
            apiClient.get<DiseaseScanResult[]>('/disease/scans'),
          ]);
          setEvents(Array.isArray(calEvents) ? calEvents : []);
          setRecentScans(Array.isArray(scans) ? scans : []);
        } catch (e) {
          console.warn('Dashboard events/scans load note:', e);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const handleToggleTask = async (id: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
      await apiClient.put(`/calendar/${id}`, { status: nextStatus });
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: nextStatus } : e))
      );
    } catch (err) {
      console.error('Failed to toggle task completion:', err);
    }
  };

  const pendingEvents = events.filter((e) => e.status === 'PENDING');

  // Crop Health Cards Data
  const cropHealthData: CropHealthProps[] = [
    {
      id: 'rice-1',
      name: 'Paddy Rice',
      stage: 'Transplanting & Tillering',
      progress: 35,
      status: 'HEALTHY',
      water: 'Submerged 3 cm',
      diseaseRisk: 'LOW',
      nextTask: 'Apply Potash top-dressing',
    },
    {
      id: 'tomato-1',
      name: 'Hybrid Tomato',
      stage: 'Vegetative Growth & Staking',
      progress: 48,
      status: 'WARNING',
      water: 'Drip 4 L/plant',
      diseaseRisk: 'MODERATE',
      nextTask: 'Bamboo staking & foliage check',
    },
    {
      id: 'chilli-1',
      name: 'Teja Chilli',
      stage: 'Flowering & Fruit Set',
      progress: 62,
      status: 'HEALTHY',
      water: 'Moist Soil',
      diseaseRisk: 'LOW',
      nextTask: 'Spray Solubor Boron 0.2%',
    },
  ];

  return (
    <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 items-start">
      <Sidebar />

      <div className="flex-1 min-w-0 space-y-6">
        {/* Welcome Hero & Farmer-First Greeting */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-farm-950/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-farm-950 text-farm-300 text-xs font-bold border border-farm-800 mb-2">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('summary_title')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t('greeting')} {farmerName} 👨‍🌾
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {t('subheading')}
            </p>
          </div>
          <Link
            href="/disease-scanner"
            className="px-5 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-farm-600 to-emerald-600 hover:from-farm-500 hover:to-emerald-500 shadow-xl shadow-farm-950/50 flex items-center gap-2 hover:scale-105 transition-all flex-shrink-0"
          >
            <Scan className="w-4 h-4" />
            <span>{t('scan_shortcut')}</span>
          </Link>
        </div>

        {/* Executive Summary Cards */}
        <FarmSummaryCards
          totalFarms={user?.farms?.length || 1}
          activeCrops={3}
          totalArea={user?.profile?.farmSize || 4.5}
          pendingActivities={pendingEvents.length}
        />

        {/* Weather Alerts Banner */}
        <AlertsBanner alerts={alerts} />

        {/* Live Weather Widget */}
        <WeatherWidget weather={weather} />

        {/* My Crops - Premium Visual Crop Health Cards Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                My Crops & Visual Health Progress
              </h3>
              <p className="text-xs text-slate-400">Real-time crop development stage, moisture levels, and disease risks</p>
            </div>
            <Link href="/crops" className="text-xs font-bold text-farm-400 hover:underline flex items-center gap-1">
              Crops Catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cropHealthData.map((crop) => (
              <CropHealthCard key={crop.id} {...crop} />
            ))}
          </div>
        </div>

        {/* Interactive Crop Growth Timeline Modal */}
        <CropGrowthTimeline />

        {/* Visual Farm Field Overview Map */}
        <FarmFieldMap />

        {/* Smart Actionable Alert Center */}
        <SmartAlertCenter />

        {/* Two Column Grid: Today's Tasks & Soil Condition */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Farm Tasks (2 cols) */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-farm-400" />
                  Today's Field Tasks & Smart Schedule
                </h3>
                <p className="text-xs text-slate-400">1-Click completion toggle overlaid with live weather alerts</p>
              </div>
              <Link href="/calendar" className="text-xs font-semibold text-farm-400 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <QuickTasks events={pendingEvents.slice(0, 4)} onToggleComplete={handleToggleTask} />
          </div>

          {/* Soil Condition Summary (1 col) */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TestTube className="w-4 h-4 text-emerald-400" />
                  Soil Condition
                </h3>
                <Link href="/soil" className="text-[11px] text-farm-400 font-semibold hover:underline">
                  Full Diagnostics
                </Link>
              </div>
              <p className="text-xs text-slate-400">Kottayam Sector 2 (Clay Loam)</p>

              <SoilHealthGauge score={soilRecord?.healthScore || 86.5} statusText="Optimal Healthy Soil" size={140} />
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs space-y-1">
              <p className="font-semibold text-slate-200">🧪 Soil pH: {soilRecord?.ph || 6.4}</p>
              <p className="text-slate-400">Moisture: {soilRecord?.moisture || 45.2}% | N: {soilRecord?.nitrogen || 220} ppm</p>
            </div>
          </div>
        </div>

        {/* Live Market Information & Recent Disease Scans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Market Crop Prices */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  Live Market Crop Prices
                </h3>
                <p className="text-xs text-slate-400">Latest local wholesale mandi price tracking</p>
              </div>
              <Link href="/market" className="text-xs font-semibold text-farm-400 hover:underline flex items-center gap-1">
                Market Trends <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {marketPrices.slice(0, 3).map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{item.cropName}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      item.priceChange >= 0 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                    }`}>
                      {item.priceChange >= 0 ? `+₹${item.priceChange}` : `-₹${Math.abs(item.priceChange)}`}
                    </span>
                  </div>
                  <p className="text-base font-extrabold text-slate-100">{formatCurrency(item.currentPrice)} <span className="text-[10px] font-normal text-slate-400">/ kg</span></p>
                  <p className="text-[10px] text-slate-400 truncate">{item.market}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Disease Scans Shortcut Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Scan className="w-4 h-4 text-emerald-400" />
                  Recent Crop Disease Scans
                </h3>
                <p className="text-xs text-slate-400">Saved scan history and diagnosis logs</p>
              </div>
              <Link href="/disease-scanner" className="text-xs font-semibold text-farm-400 hover:underline flex items-center gap-1">
                Open Scanner <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentScans.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400 space-y-2">
                <p>No leaf scans performed yet.</p>
                <Link href="/disease-scanner" className="inline-block text-farm-400 font-bold hover:underline">
                  + Scan your first leaf photo
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentScans.slice(0, 3).map((scan) => (
                  <div key={scan.id} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{scan.detectedDisease}</p>
                      <p className="text-[10px] text-slate-400">Crop: {scan.cropName}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      scan.confidenceLevel === 'HIGH'
                        ? 'bg-farm-950 text-farm-300 border-farm-800'
                        : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}>
                      {scan.confidence}% Confidence
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
