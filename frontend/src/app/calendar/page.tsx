'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/apiClient';
import { CropCalendarEvent, Crop } from '../../types';
import { formatDate } from '../../lib/utils';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  CloudRain,
  Plus,
  Droplets,
  Sprout,
  ShieldAlert,
  Bug,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function CalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CropCalendarEvent[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'COMPLETED' | 'ALL'>('PENDING');
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('ALL');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // Form modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState('');
  const [plantingDate, setPlantingDate] = useState(new Date().toISOString().split('T')[0]);
  const [creating, setCreating] = useState(false);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const [eventsRes, cropsRes] = await Promise.all([
        apiClient.get<CropCalendarEvent[]>('/calendar'),
        apiClient.get<Crop[]>('/crops'),
      ]);
      setEvents(eventsRes);
      setCrops(cropsRes);
      if (cropsRes.length > 0) setSelectedCropId(cropsRes[0].id);
    } catch (err) {
      console.error('Failed to load calendar events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, [user]);

  const handleToggleComplete = async (id: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
      await apiClient.put(`/calendar/${id}`, { status: nextStatus });
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: nextStatus } : e))
      );
    } catch (err) {
      console.error('Failed to update event:', err);
    }
  };

  const handleGenerateCalendar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await apiClient.post('/calendar/generate', {
        cropId: selectedCropId,
        plantingDate,
      });
      setShowModal(false);
      fetchCalendarData();
    } catch (err) {
      console.error('Failed to generate crop calendar:', err);
    } finally {
      setCreating(false);
    }
  };

  const filteredEvents = events.filter((e) => {
    if (activeTab === 'PENDING' && e.status !== 'PENDING') return false;
    if (activeTab === 'COMPLETED' && e.status !== 'COMPLETED') return false;
    if (selectedCropFilter !== 'ALL' && e.crop?.name !== selectedCropFilter) return false;
    return true;
  });

  return (
    <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      <Sidebar />

      <div className="flex-1 min-w-0 space-y-6">
        {/* Header Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-farm-950/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-farm-950 text-farm-300 text-xs font-bold border border-farm-800">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full 13-Stage Agronomic Timeline (Rice, Tomato, Chilli)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Advanced Crop Farming Calendar
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Agronomic stage schedules calculated from actual planting date, with water, nutrient, and weather overlays.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-farm-600 to-emerald-600 hover:from-farm-500 hover:to-emerald-500 shadow-md flex items-center gap-2 hover:scale-105 transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New 13-Stage Calendar</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('PENDING')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'PENDING'
                  ? 'bg-farm-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Pending Tasks ({events.filter((e) => e.status === 'PENDING').length})
            </button>

            <button
              onClick={() => setActiveTab('COMPLETED')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'COMPLETED'
                  ? 'bg-farm-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Completed ({events.filter((e) => e.status === 'COMPLETED').length})
            </button>

            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'ALL'
                  ? 'bg-farm-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              All Events ({events.length})
            </button>
          </div>

          {/* Crop Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Filter Crop:</span>
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 focus:border-farm-500 outline-none"
            >
              <option value="ALL">All Crops (Rice, Tomato, Chilli)</option>
              <option value="Rice">🌾 Rice</option>
              <option value="Tomato">🍅 Tomato</option>
              <option value="Chilli">🌶️ Chilli</option>
            </select>
          </div>
        </div>

        {/* 13-Stage Calendar Event List */}
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-24 bg-slate-900 rounded-2xl"></div>
            <div className="h-24 bg-slate-900 rounded-2xl"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="glass-panel p-10 rounded-3xl text-center text-slate-400 border border-slate-800 space-y-3">
            <CalendarIcon className="w-10 h-10 mx-auto text-slate-500" />
            <h3 className="text-base font-bold text-white">No calendar events found for this filter</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Click "Generate New 13-Stage Calendar" to build a date-driven schedule for Rice, Tomato, or Chilli.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => {
              const isDone = event.status === 'COMPLETED';
              const isExpanded = expandedEventId === event.id;

              return (
                <div
                  key={event.id}
                  className={`glass-panel p-5 rounded-2xl border transition-all ${
                    isDone
                      ? 'bg-slate-900/40 border-slate-800 opacity-75'
                      : event.isSmartAdjusted
                      ? 'bg-amber-950/20 border-amber-800/80 shadow-lg shadow-amber-950/30'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Completion Toggle */}
                    <button
                      onClick={() => handleToggleComplete(event.id, event.status)}
                      className="mt-1 text-slate-400 hover:text-farm-400 transition-colors"
                      title={isDone ? 'Mark Incomplete' : 'Mark Complete'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-6 h-6 text-farm-400 fill-farm-950" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-400" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            event.priority === 'HIGH'
                              ? 'bg-red-950 text-red-400 border-red-800'
                              : 'bg-farm-950 text-farm-300 border-farm-800'
                          }`}>
                            {event.priority || 'MEDIUM'} Priority
                          </span>
                          <h3 className={`text-base font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                            {event.activityName}
                          </h3>
                        </div>

                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-farm-300 border border-slate-700 w-fit">
                          {event.crop?.name || 'Crop'}
                        </span>
                      </div>

                      {/* Agronomic Details */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
                        <span>📅 Scheduled: <strong className="text-slate-200">{formatDate(event.scheduledDate)}</strong></span>
                        <span>🌱 Stage: <strong className="text-farm-300">{event.stage}</strong></span>
                        {event.completedDate && <span className="text-emerald-400">✅ Completed on {formatDate(event.completedDate)}</span>}
                      </div>

                      {/* Smart Weather Impact Banner */}
                      {event.weatherImpact && (
                        <div className="mt-3 p-3 rounded-xl bg-amber-950/60 border border-amber-800/80 text-xs text-amber-200 flex items-center gap-2.5">
                          <CloudRain className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <span>{event.weatherImpact}</span>
                        </div>
                      )}

                      {/* Description & Agronomic Notes */}
                      {event.description && (
                        <p className="text-xs text-slate-300 mt-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                          💡 <strong>Agronomic Guidance:</strong> {event.description}
                        </p>
                      )}

                      {/* Expandable Agronomic Requirements Toggle */}
                      <button
                        onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                        className="mt-3 text-[11px] font-semibold text-farm-400 hover:text-farm-300 flex items-center gap-1"
                      >
                        {isExpanded ? (
                          <>
                            <span>Hide Detailed Stage Requirements</span>
                            <ChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <span>View Water, Fertilizer, Soil & Pest Requirements</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>

                      {/* Expanded Stage Requirements Grid */}
                      {isExpanded && (
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                          {event.waterRequirement && (
                            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                              <span className="font-bold text-blue-400 flex items-center gap-1.5">
                                <Droplets className="w-3.5 h-3.5" /> Water Requirement:
                              </span>
                              <p className="text-slate-300 text-[11px]">{event.waterRequirement}</p>
                            </div>
                          )}

                          {event.fertilizerTask && (
                            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                              <span className="font-bold text-farm-400 flex items-center gap-1.5">
                                <Sprout className="w-3.5 h-3.5" /> Nutrient & Fertilizer Task:
                              </span>
                              <p className="text-slate-300 text-[11px]">{event.fertilizerTask}</p>
                            </div>
                          )}

                          {event.diseaseMonitoring && (
                            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                                <ShieldAlert className="w-3.5 h-3.5" /> Disease Monitoring:
                              </span>
                              <p className="text-slate-300 text-[11px]">{event.diseaseMonitoring}</p>
                            </div>
                          )}

                          {event.pestMonitoring && (
                            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                              <span className="font-bold text-red-400 flex items-center gap-1.5">
                                <Bug className="w-3.5 h-3.5" /> Pest Advisory:
                              </span>
                              <p className="text-slate-300 text-[11px]">{event.pestMonitoring}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Generate Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="text-lg font-extrabold text-white">Generate 13-Stage Crop Calendar</h3>
              <p className="text-xs text-slate-300">
                Select your crop (Rice, Tomato, Chilli) and actual field planting date to build a stage-by-stage agronomic schedule.
              </p>

              <form onSubmit={handleGenerateCalendar} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Select Crop</label>
                  <select
                    value={selectedCropId}
                    onChange={(e) => setSelectedCropId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-farm-500 outline-none"
                  >
                    {crops.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.scientificName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Actual Field Planting Date</label>
                  <input
                    type="date"
                    required
                    value={plantingDate}
                    onChange={(e) => setPlantingDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-farm-500 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-farm-600 hover:bg-farm-500 rounded-xl shadow-md"
                  >
                    {creating ? 'Generating...' : 'Generate 13-Stage Calendar'}
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
