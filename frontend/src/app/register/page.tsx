'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '../../components/ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Phone, MapPin, Maximize, Award, Sprout, ArrowRight, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: 'Kottayam, Kerala',
    farmSize: '3.5',
    farmingExperience: '5 years',
    mainCrop: 'Rice',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(formData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-xl glass-panel p-8 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Logo size="lg" className="justify-center" />
          <h2 className="text-xl font-bold text-white mt-4">Create Your FarmProfile</h2>
          <p className="text-xs text-slate-400">Join FarmPilot AI for personalized weather alerts & smart crop calendars</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Infan Rahman"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-farm-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. infan@example.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-farm-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-farm-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-farm-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Farm Location</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Kottayam, Kerala"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-farm-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Farm Size (Acres)</label>
            <div className="relative">
              <Maximize className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="number"
                step="0.5"
                name="farmSize"
                value={formData.farmSize}
                onChange={handleChange}
                placeholder="3.5"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-farm-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Farming Experience</label>
            <div className="relative">
              <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                name="farmingExperience"
                value={formData.farmingExperience}
                onChange={handleChange}
                placeholder="8 years"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-farm-500 outline-none"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Main Crop Variety</label>
            <div className="relative">
              <Sprout className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <select
                name="mainCrop"
                value={formData.mainCrop}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-farm-500 outline-none"
              >
                <option value="Rice">Rice (Paddy)</option>
                <option value="Tomato">Tomato</option>
                <option value="Coconut">Coconut Palm</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-farm-600 to-emerald-600 hover:from-farm-500 hover:to-emerald-500 shadow-lg shadow-farm-900/40 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Creating Your Profile...</span>
              ) : (
                <>
                  <span>Complete Farmer Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link href="/login" className="text-farm-400 hover:underline font-semibold">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
