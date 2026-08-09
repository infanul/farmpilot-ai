import React from 'react';
import { Home, Sprout, Maximize, Calendar } from 'lucide-react';

interface FarmSummaryProps {
  totalFarms: number;
  activeCrops: number;
  totalArea: number;
  pendingActivities: number;
}

export const FarmSummaryCards: React.FC<FarmSummaryProps> = ({
  totalFarms,
  activeCrops,
  totalArea,
  pendingActivities,
}) => {
  const cards = [
    {
      title: 'Total Farms',
      value: `${totalFarms} ${totalFarms === 1 ? 'Plot' : 'Plots'}`,
      subtitle: 'Registered farm land',
      icon: Home,
      color: 'from-blue-600/20 to-blue-900/30 border-blue-600/40 text-blue-400',
    },
    {
      title: 'Active Crops',
      value: `${activeCrops} Varieties`,
      subtitle: 'Rice, Tomato & Coconut',
      icon: Sprout,
      color: 'from-farm-600/20 to-farm-900/30 border-farm-600/40 text-farm-400',
    },
    {
      title: 'Farm Area',
      value: `${totalArea} Acres`,
      subtitle: 'Total cultivated acreage',
      icon: Maximize,
      color: 'from-amber-600/20 to-amber-900/30 border-amber-600/40 text-amber-400',
    },
    {
      title: 'Upcoming Activities',
      value: `${pendingActivities} Tasks`,
      subtitle: 'Scheduled field tasks',
      icon: Calendar,
      color: 'from-purple-600/20 to-purple-900/30 border-purple-600/40 text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`glass-panel p-5 rounded-2xl border bg-gradient-to-br ${card.color} shadow-lg transition-transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{card.title}</span>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white">{card.value}</p>
            <p className="text-[11px] text-slate-400 mt-1">{card.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
};
