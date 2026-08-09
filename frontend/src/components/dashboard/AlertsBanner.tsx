import React from 'react';
import { WeatherAlert } from '../../types';
import { AlertTriangle, Info, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AlertsBannerProps {
  alerts: WeatherAlert[];
}

export const AlertsBanner: React.FC<AlertsBannerProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  const severityStyles = {
    INFO: 'bg-blue-950/60 border-blue-800 text-blue-300',
    LOW: 'bg-slate-900/60 border-slate-700 text-slate-300',
    MEDIUM: 'bg-amber-950/60 border-amber-800/80 text-amber-200',
    HIGH: 'bg-orange-950/70 border-orange-800 text-orange-200',
    CRITICAL: 'bg-red-950/80 border-red-800 text-red-200 shadow-lg shadow-red-950/50 animate-pulse',
  };

  const severityIcons = {
    INFO: Info,
    LOW: Info,
    MEDIUM: AlertTriangle,
    HIGH: AlertTriangle,
    CRITICAL: ShieldAlert,
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const Icon = severityIcons[alert.severity] || AlertTriangle;
        return (
          <div
            key={alert.id}
            className={`p-4 rounded-2xl border ${severityStyles[alert.severity]} flex items-start gap-3.5 transition-all`}
          >
            <div className="p-2 rounded-xl bg-slate-900/80 border border-current flex-shrink-0 mt-0.5">
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold tracking-tight">{alert.title}</h4>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-900/80 border border-current">
                  {alert.severity}
                </span>
              </div>
              <p className="text-xs mt-1 text-slate-300 leading-relaxed">{alert.description}</p>
              {alert.recommendedAction && (
                <div className="mt-2 text-xs font-semibold text-white bg-slate-900/70 px-3 py-1.5 rounded-lg border border-slate-700/50 flex items-center gap-1.5">
                  <span>👉 Action:</span>
                  <span>{alert.recommendedAction}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
