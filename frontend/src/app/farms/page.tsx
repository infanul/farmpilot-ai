'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/apiClient';
import { Farm, Crop } from '../../types';
import { Home, Plus, MapPin, Maximize, Droplets, Trash2, Sprout } from 'lucide-react';

export default function FarmsPage() {
  const { user } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: '',
    location: 'Kottayam, Kerala',
    area: '2.5',
    soilType: 'Clay Loam',
    irrigationType: 'Drip & Canal Irrigation',
    mainCropId: '',
  });

  const fetchFarmsData = () => {
    setLoading(true);
    Promise.all([
      apiClient.get<Farm[]>('/farms'),
      apiClient.get<Crop[]>('/crops'),
    ])
      .then(([farmsRes, cropsRes]) => {
        setFarms(farmsRes);
        setCrops(cropsRes);
        if (cropsRes.length > 0) setForm((prev) => ({ ...prev, mainCropId: cropsRes[0].id }));
      })
      .catch((err) => console.error('Failed to load farms data:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFarmsData();
  }, [user]);

  const handleCreateFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/farms', form);
      setShowModal(false);
      setForm({ name: '', location: 'Kottayam, Kerala', area: '2.5', soilType: 'Clay Loam', irrigationType: 'Drip & Canal Irrigation', mainCropId: '' });
      fetchFarmsData();
    } catch (err) {
      console.error('Failed to create farm:', err);
    }
  };

  const handleDeleteFarm = async (id: string) => {
    if (confirm('Are you sure you want to remove this farm plot?')) {
      try {
        await apiClient.delete(`/farms/${id}`);
        fetchFarmsData();
      } catch (err) {
        console.error('Failed to delete farm:', err);
      }
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      <Sidebar />

      <div className="flex-1 min-w-0 space-y-6">
        {/* Header */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-farm-950/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-farm-400 bg-farm-950 px-3 py-1 rounded-full border border-farm-800">
              Multi-Plot Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 flex items-center gap-2">
              <Home className="w-7 h-7 text-farm-400" />
              My Farms & Cultivated Plots
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Add and manage multiple farm locations, soil types, and crop allocations.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-farm-600 to-emerald-600 hover:from-farm-500 hover:to-emerald-500 shadow-md flex items-center gap-2 hover:scale-105 transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Farm Plot</span>
          </button>
        </div>

        {/* Farms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {farms.map((farm) => (
            <div key={farm.id} className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl space-y-4 relative group">
              <button
                onClick={() => handleDeleteFarm(farm.id)}
                className="absolute top-5 right-5 p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete Farm"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-farm-400 bg-farm-950 px-2.5 py-0.5 rounded-full border border-farm-800">
                  Registered Farm Plot
                </span>
                <h3 className="text-xl font-bold text-white">{farm.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-farm-400" /> {farm.location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-[10px] uppercase text-slate-400 font-semibold">Total Area</p>
                  <p className="text-sm font-bold text-white mt-0.5">{farm.area} Acres</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-[10px] uppercase text-slate-400 font-semibold">Soil Category</p>
                  <p className="text-sm font-bold text-white mt-0.5">{farm.soilType}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 col-span-2">
                  <p className="text-[10px] uppercase text-slate-400 font-semibold">Irrigation System</p>
                  <p className="text-sm font-bold text-white mt-0.5">{farm.irrigationType}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Farm Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900 max-w-md w-full space-y-4">
              <h3 className="text-lg font-bold text-white">Add New Farm Plot</h3>

              <form onSubmit={handleCreateFarm} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Farm Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Green Horizon East Plot"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="Kottayam, Kerala"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Soil Type</label>
                  <input
                    type="text"
                    value={form.soilType}
                    onChange={(e) => setForm({ ...form, soilType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Irrigation Type</label>
                  <input
                    type="text"
                    value={form.irrigationType}
                    onChange={(e) => setForm({ ...form, irrigationType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
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
                    Save Farm Plot
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
