'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { SoilHealthGauge } from '../../components/soil/SoilHealthGauge';
import { apiClient } from '../../lib/apiClient';
import { SoilRecord } from '../../types';
import { TestTube, Plus, CheckCircle, Info, Sparkles } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export default function SoilPage() {
  const [records, setRecords] = useState<SoilRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    location: 'Kottayam, Sector 2',
    soilType: 'Clay Loam',
    ph: '6.5',
    moisture: '42.5',
    nitrogen: '210',
    phosphorus: '28',
    potassium: '195',
    organicMatter: '2.8',
  });

  const fetchSoilRecords = () => {
    setLoading(true);
    apiClient
      .get<SoilRecord[]>('/soil')
      .then(setRecords)
      .catch((err) => console.error('Failed to load soil records:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSoilRecords();
  }, []);

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/soil', form);
      setShowModal(false);
      fetchSoilRecords();
    } catch (err) {
      console.error('Failed to log soil test:', err);
    }
  };

  const activeRecord = records[0];

  return (
    <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      <Sidebar />

      <div className="flex-1 min-w-0 space-y-6">
        {/* Header */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-farm-950/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-farm-400 bg-farm-950 px-3 py-1 rounded-full border border-farm-800">
              Nutrient & Moisture Analytics
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 flex items-center gap-2">
              <TestTube className="w-7 h-7 text-emerald-400" />
              Soil Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Track N-P-K nutrient status, organic matter, and moisture parameters to maximize soil health.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-farm-600 to-emerald-600 hover:from-farm-500 hover:to-emerald-500 shadow-md flex items-center gap-2 hover:scale-105 transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Log Soil Test Data</span>
          </button>
        </div>

        {activeRecord && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Health Gauge Card */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                Calculated Soil Health Index
              </span>
              <SoilHealthGauge score={activeRecord.healthScore} size={180} />
              <p className="text-xs text-slate-400">Recorded on {formatDate(activeRecord.createdAt)}</p>

              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{activeRecord.isEstimated ? 'Estimated Recommendation' : 'Farmer Lab Measurement'}</span>
              </div>
            </div>

            {/* Nutrient Metrics Grid */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-farm-400" />
                Key Soil Health Indicators ({activeRecord.location})
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] uppercase text-slate-400 font-semibold">Soil pH</p>
                  <p className="text-xl font-extrabold text-white mt-1">{activeRecord.ph}</p>
                  <p className="text-[10px] text-emerald-400 mt-0.5">Optimal (6.0 - 7.2)</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] uppercase text-slate-400 font-semibold">Moisture Level</p>
                  <p className="text-xl font-extrabold text-blue-400 mt-1">{activeRecord.moisture}%</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Root Zone Capacity</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] uppercase text-slate-400 font-semibold">Nitrogen (N)</p>
                  <p className="text-xl font-extrabold text-farm-400 mt-1">{activeRecord.nitrogen} <span className="text-xs font-normal">ppm</span></p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Leaf & Tillering</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] uppercase text-slate-400 font-semibold">Phosphorus (P)</p>
                  <p className="text-xl font-extrabold text-amber-400 mt-1">{activeRecord.phosphorus} <span className="text-xs font-normal">ppm</span></p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Root Formation</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] uppercase text-slate-400 font-semibold">Potassium (K)</p>
                  <p className="text-xl font-extrabold text-purple-400 mt-1">{activeRecord.potassium} <span className="text-xs font-normal">ppm</span></p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Disease Resilience</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] uppercase text-slate-400 font-semibold">Organic Matter</p>
                  <p className="text-xl font-extrabold text-white mt-1">{activeRecord.organicMatter}%</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Humus & Biomass</p>
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="p-4 rounded-2xl bg-farm-950/60 border border-farm-800/60 space-y-1.5">
                <p className="font-bold text-xs text-farm-300">💡 Custom Soil Management Recommendations:</p>
                <p className="text-xs text-slate-300 leading-relaxed">{activeRecord.recommendations}</p>
              </div>
            </div>
          </div>
        )}

        {/* Modal for adding soil test */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900 max-w-md w-full space-y-4">
              <h3 className="text-lg font-bold text-white">Log Soil Test Results</h3>
              <form onSubmit={handleCreateRecord} className="grid grid-cols-2 gap-3 text-xs">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">Field Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Soil pH</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.ph}
                    onChange={(e) => setForm({ ...form, ph: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Moisture (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.moisture}
                    onChange={(e) => setForm({ ...form, moisture: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nitrogen (ppm)</label>
                  <input
                    type="number"
                    value={form.nitrogen}
                    onChange={(e) => setForm({ ...form, nitrogen: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Phosphorus (ppm)</label>
                  <input
                    type="number"
                    value={form.phosphorus}
                    onChange={(e) => setForm({ ...form, phosphorus: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Potassium (ppm)</label>
                  <input
                    type="number"
                    value={form.potassium}
                    onChange={(e) => setForm({ ...form, potassium: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Organic Matter (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.organicMatter}
                    onChange={(e) => setForm({ ...form, organicMatter: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>

                <div className="col-span-2 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-farm-600 hover:bg-farm-500 rounded-xl shadow-md"
                  >
                    Save Soil Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
