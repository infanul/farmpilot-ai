'use client';

import React from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Maximize, Award, Sprout, LogOut, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      <Sidebar />

      <div className="flex-1 min-w-0 space-y-6">
        {/* Header */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-farm-950/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-farm-500 to-emerald-700 text-white font-extrabold text-2xl flex items-center justify-center border-2 border-farm-400 shadow-xl">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'F'}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">{user?.name || 'Farmer'}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email || 'farmer@farmpilot.ai'}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-red-300 bg-red-950/60 hover:bg-red-900/60 border border-red-800 flex items-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Profile Specification Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-farm-400" />
            Farmer Identity & Agronomic Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase text-slate-400 font-semibold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-farm-400" /> Phone Contact
              </span>
              <p className="text-sm font-bold text-white">{user?.profile?.phone || '+91 98765 43210'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase text-slate-400 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-farm-400" /> Region / Location
              </span>
              <p className="text-sm font-bold text-white">{user?.profile?.location || 'Kottayam, Kerala'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase text-slate-400 font-semibold flex items-center gap-1">
                <Maximize className="w-3.5 h-3.5 text-farm-400" /> Total Farm Acreage
              </span>
              <p className="text-sm font-bold text-white">{user?.profile?.farmSize || 4.5} Acres</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase text-slate-400 font-semibold flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-farm-400" /> Farming Experience
              </span>
              <p className="text-sm font-bold text-white">{user?.profile?.farmingExperience || '8 years'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1 sm:col-span-2">
              <span className="text-[10px] uppercase text-slate-400 font-semibold flex items-center gap-1">
                <Sprout className="w-3.5 h-3.5 text-farm-400" /> Primary Crop Varieties
              </span>
              <p className="text-sm font-bold text-white">{user?.profile?.mainCrop || 'Rice, Tomato & Coconut'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
