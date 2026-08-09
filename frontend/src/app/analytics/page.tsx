'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { apiClient } from '../../lib/apiClient';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, CheckCircle2, Calendar, Droplets } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<any>('/analytics')
      .then(setData)
      .catch((err) => console.error('Failed to load analytics:', err))
      .finally(() => setLoading(false));
  }, []);

  const COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#a855f7'];

  const activityData = [
    { name: 'Completed Tasks', value: data?.completedTasks || 3 },
    { name: 'Pending Tasks', value: data?.activeCalendarTasks || 2 },
  ];

  return (
    <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      <Sidebar />

      <div className="flex-1 min-w-0 space-y-6">
        {/* Header */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-farm-950/60 shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-farm-400 bg-farm-950 px-3 py-1 rounded-full border border-farm-800">
            Agronomic Performance Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-farm-400" />
            Farm Analytics & Progress
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Visual metrics for seasonal rainfall, crop harvest progress, completed activities, and expenditure.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
            <p className="text-xs text-slate-400 font-semibold uppercase">Harvest Progress</p>
            <p className="text-2xl font-extrabold text-white mt-1">{data?.harvestProgress || 60}%</p>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div className="bg-farm-500 h-full rounded-full" style={{ width: `${data?.harvestProgress || 60}%` }}></div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
            <p className="text-xs text-slate-400 font-semibold uppercase">Total Land Plots</p>
            <p className="text-2xl font-extrabold text-farm-400 mt-1">{data?.totalFarms || 1} Farm</p>
            <p className="text-[11px] text-slate-400 mt-1">3.5 Cultivated Acres</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
            <p className="text-xs text-slate-400 font-semibold uppercase">Pending Tasks</p>
            <p className="text-2xl font-extrabold text-amber-400 mt-1">{data?.activeCalendarTasks || 2} Tasks</p>
            <p className="text-[11px] text-slate-400 mt-1">Next due in 3 days</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
            <p className="text-xs text-slate-400 font-semibold uppercase">Total Investment</p>
            <p className="text-2xl font-extrabold text-purple-400 mt-1">{formatCurrency(data?.totalExpenses || 17100)}</p>
            <p className="text-[11px] text-slate-400 mt-1">Seeds, Fertilizer & Labour</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Rainfall & Soil Moisture */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              Monthly Rainfall (mm) & Soil Moisture (%)
            </h3>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.monthlyRainfall || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="rainfall" fill="#3b82f6" name="Rainfall (mm)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="moisture" fill="#22c55e" name="Moisture (%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Status Breakdown */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-farm-400" />
              Crop Activity Execution Breakdown
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={activityData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-6 text-xs font-semibold">
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Completed ({data?.completedTasks || 3})
              </div>
              <div className="flex items-center gap-2 text-amber-400">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span> Pending ({data?.activeCalendarTasks || 2})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
