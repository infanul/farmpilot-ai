'use client';

import React from 'react';
import { WeatherData } from '../../types';
import { CloudRain, Wind, Droplets, Sun, Sunset, Eye, Gauge, Compass } from 'lucide-react';

interface WeatherWidgetProps {
  weather: WeatherData | null;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather }) => {
  if (!weather) {
    return (
      <div className="glass-panel p-6 rounded-2xl animate-pulse space-y-4">
        <div className="h-6 bg-slate-800 rounded w-1/3"></div>
        <div className="h-12 bg-slate-800 rounded w-1/2"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="h-16 bg-slate-800 rounded"></div>
          <div className="h-16 bg-slate-800 rounded"></div>
          <div className="h-16 bg-slate-800 rounded"></div>
          <div className="h-16 bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-900/90 to-farm-950/40 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-farm-400" />
            <h3 className="text-sm font-semibold text-slate-300">{weather.location}</h3>
          </div>
          <p className="text-2xl font-extrabold text-white mt-1">
            {weather.temperature}°C
            <span className="text-xs font-normal text-slate-400 ml-2">Feels like {weather.feelsLike}°C</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-farm-300">{weather.condition}</p>
            <p className="text-xs text-slate-400">Rain Prob: {weather.rainProbability}%</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-farm-900/50 border border-farm-700/50 flex items-center justify-center text-farm-400 text-xl font-bold">
            🌤️
          </div>
        </div>
      </div>

      {/* Main Grid Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-center gap-3">
          <Droplets className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Humidity</p>
            <p className="text-sm font-bold text-slate-100">{weather.humidity}%</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-center gap-3">
          <Wind className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Wind Speed</p>
            <p className="text-sm font-bold text-slate-100">{weather.windSpeed} km/h</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-center gap-3">
          <Gauge className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Pressure</p>
            <p className="text-sm font-bold text-slate-100">{weather.pressure} hPa</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-center gap-3">
          <Eye className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Visibility</p>
            <p className="text-sm font-bold text-slate-100">{weather.visibility || 8.5} km</p>
          </div>
        </div>
      </div>

      {/* Dynamic Farming Recommendations */}
      {weather.recommendations && weather.recommendations.length > 0 && (
        <div className="mt-4 p-3.5 rounded-xl bg-farm-950/60 border border-farm-800/60 text-xs space-y-1.5">
          <p className="font-bold text-farm-300 flex items-center gap-1.5">
            💡 Dynamic Weather Farming Advice
          </p>
          {weather.recommendations.map((rec, idx) => (
            <p key={idx} className="text-slate-300 leading-relaxed pl-2 border-l-2 border-farm-500">
              {rec}
            </p>
          ))}
        </div>
      )}

      {/* 5–7 Day Forecast Preview */}
      <div className="mt-5 pt-4 border-t border-slate-800">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">7-Day Weather Forecast</h4>
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
          {weather.forecast.map((day, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl text-center border transition-all ${
                idx === 0
                  ? 'bg-farm-900/40 border-farm-600/50 text-farm-200'
                  : 'bg-slate-800/30 border-slate-700/30 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <p className="text-xs font-bold">{day.day}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{day.date}</p>
              <p className="text-sm font-extrabold my-1 text-white">{day.tempMax}°</p>
              <p className="text-[10px] text-blue-400 font-medium">🌧️ {day.rainProbability}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
