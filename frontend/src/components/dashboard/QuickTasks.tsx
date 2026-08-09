'use client';

import React from 'react';
import { CropCalendarEvent } from '../../types';
import { CheckCircle2, Circle, Calendar, CloudRain } from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface QuickTasksProps {
  events: CropCalendarEvent[];
  onToggleComplete?: (id: string, currentStatus: string) => void;
}

export const QuickTasks: React.FC<QuickTasksProps> = ({ events, onToggleComplete }) => {
  if (!events || events.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400 glass-panel rounded-2xl">
        <Calendar className="w-8 h-8 mx-auto text-slate-500 mb-2" />
        <p className="text-sm font-medium">No pending tasks scheduled for today.</p>
        <p className="text-xs text-slate-500 mt-1">Check your Crop Calendar page for long-term field planning.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => {
        const isDone = event.status === 'COMPLETED';

        return (
          <div
            key={event.id}
            className={`p-4 rounded-2xl border transition-all ${
              isDone
                ? 'bg-slate-900/40 border-slate-800 opacity-75'
                : event.isSmartAdjusted
                ? 'bg-amber-950/20 border-amber-800/60'
                : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => onToggleComplete && onToggleComplete(event.id, event.status)}
                className="mt-0.5 text-slate-400 hover:text-farm-400 transition-colors"
                title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-farm-400 fill-farm-950" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                    {event.activityName}
                  </h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-farm-300 border border-slate-700">
                    {event.crop?.name || 'Crop'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                  <span>📅 {formatDate(event.scheduledDate)}</span>
                  <span>🌱 Stage: {event.stage}</span>
                </div>

                {/* Weather Impact Smart Notification */}
                {event.weatherImpact && (
                  <div className="mt-2.5 p-2 rounded-lg bg-amber-900/30 border border-amber-700/40 text-xs text-amber-200 flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>{event.weatherImpact}</span>
                  </div>
                )}

                {event.recommendation && (
                  <p className="text-xs text-slate-300 mt-2 italic bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                    💡 {event.recommendation}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
