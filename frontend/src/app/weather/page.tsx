'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { WeatherWidget } from '../../components/dashboard/WeatherWidget';
import { apiClient } from '../../lib/apiClient';
import { WeatherData } from '../../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { CloudSun, Search, Droplets, Wind, Thermometer } from 'lucide-react';

export default function WeatherPage() {
  const [locationInput, setLocationInput] = useState('Kottayam, Kerala');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeatherData = (loc: string) => {
    setLoading(true);
    apiClient
      .get<WeatherData>(`/weather?location=${encodeURIComponent(loc)}`)
      .then(setWeather)
      .catch((err) => console.error('Failed to load weather:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWeatherData(locationInput);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationInput) fetchWeatherData(locationInput);
  };

  // Recharts data format from hourly forecast
  const chartData = weather?.hourly.map((h) => ({
    time: h.time,
    temperature: h.temp,
    rainProbability: h.rainProbability,
  })) || [];

  return (
    <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      <Sidebar />

      <div className="flex-1 min-w-0 space-y-6">
        {/* Header & Location Search */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-farm-950/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-farm-400 bg-farm-950 px-3 py-1 rounded-full border border-farm-800">
              Live Meteorological Engine
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 flex items-center gap-2">
              <CloudSun className="w-7 h-7 text-amber-400" />
              Weather Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Hourly and multi-day microclimate data tailored to your agricultural region.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Enter City / Location"
              className="bg-slate-950 border border-slate-700 text-xs rounded-xl px-3 py-2.5 text-white outline-none focus:border-farm-500 w-full sm:w-48"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-farm-600 hover:bg-farm-500 text-xs font-bold text-white shadow-md flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* Main Weather Widget */}
        <WeatherWidget weather={weather} />

        {/* Dynamic Recharts Visualizations */}
        {weather && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Temperature Trend Chart */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-amber-400" />
                Hourly Temperature Trend (°C)
              </h3>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#tempGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rainfall Probability Chart */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                Rainfall Probability Forecast (%)
              </h3>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="rainProbability" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
