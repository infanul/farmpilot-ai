'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { apiClient } from '../../lib/apiClient';
import { MarketPrice } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw, Filter } from 'lucide-react';

export default function MarketPage() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d'>('7d');
  const [trendData, setTrendData] = useState<{ date: string; price: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiClient.get<MarketPrice[]>('/market'),
      apiClient.get<{ trends: { date: string; price: number }[] }>(
        `/market/trends?crop=${selectedCrop}&period=${selectedPeriod}`
      ),
    ])
      .then(([pricesRes, trendRes]) => {
        setPrices(pricesRes);
        setTrendData(trendRes.trends);
      })
      .catch((err) => console.error('Failed to load market data:', err))
      .finally(() => setLoading(false));
  }, [selectedCrop, selectedPeriod]);

  return (
    <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      <Sidebar />

      <div className="flex-1 min-w-0 space-y-6">
        {/* Header */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-farm-950/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-farm-400 bg-farm-950 px-3 py-1 rounded-full border border-farm-800">
              Wholesale Mandi Tracking
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-amber-400" />
              Market Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Real-time regional crop price tracking and historical 7-day & 30-day market trend analytics.
            </p>
          </div>
        </div>

        {/* Recharts Price Trend Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Price Trend Analytics ({selectedCrop})</h3>
              <p className="text-xs text-slate-400">Fluctuation curve over selected timeframe</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs font-semibold text-white rounded-xl px-3 py-2 outline-none"
              >
                <option value="Rice">Rice (Paddy)</option>
                <option value="Tomato">Tomato</option>
                <option value="Coconut">Coconut</option>
              </select>

              <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                <button
                  onClick={() => setSelectedPeriod('7d')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                    selectedPeriod === '7d' ? 'bg-farm-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setSelectedPeriod('30d')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                    selectedPeriod === '30d' ? 'bg-farm-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  30 Days
                </button>
              </div>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Prices Grid */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Current Regional Mandi Rates</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {prices.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{item.cropName}</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
                      item.priceChange >= 0
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-red-950 text-red-400 border border-red-800'
                    }`}
                  >
                    {item.priceChange >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {item.priceChange >= 0 ? `+₹${item.priceChange}` : `-₹${Math.abs(item.priceChange)}`}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <p className="text-2xl font-extrabold text-white">
                    {formatCurrency(item.currentPrice)} <span className="text-xs font-normal text-slate-400">/ kg</span>
                  </p>
                  <p className="text-xs text-slate-400 line-through">Prev: ₹{item.previousPrice}</p>
                </div>

                <p className="text-xs text-slate-400 pt-1 border-t border-slate-800/60">
                  📍 {item.market}, {item.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
