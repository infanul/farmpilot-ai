'use client';

import React from 'react';
import { DiseaseScanResult } from '../../types';
import {
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  BookOpen,
  AlertTriangle,
  XCircle,
  Cpu,
  UserCheck,
  Zap,
} from 'lucide-react';

interface ScanResultsProps {
  result: DiseaseScanResult | null;
}

export const ScanResultsCard: React.FC<ScanResultsProps> = ({ result }) => {
  if (!result) return null;

  // 1. REJECTED IMAGE CARD
  if (result.confidenceLevel === 'REJECTED') {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-red-800/80 bg-red-950/30 text-red-200 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-red-900/60 text-red-300">
            <XCircle className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold uppercase">
              Validation Failed: {result.rejectionReason || 'IMAGE_QUALITY'}
            </div>
            <h3 className="text-base font-extrabold text-white mt-1">Image Quality Check Failed</h3>
            <p className="text-xs text-red-300">Image could not be reliably evaluated</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-red-900/50 space-y-2 text-xs text-slate-300 leading-relaxed">
          <p className="font-semibold text-red-300">{result.treatmentGuidance.expertAdvice}</p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Ensure the camera lens is clean and focused directly on the leaf.</li>
            <li>Photograph the leaf in natural daylight without dark shadows.</li>
            <li>Make sure the leaf surface belongs to Rice, Tomato, or Chilli.</li>
          </ul>
        </div>
      </div>
    );
  }

  // 2. LOW CONFIDENCE / UNCERTAIN DIAGNOSIS CARD
  if (result.isLowConfidence || result.confidenceLevel === 'LOW') {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-amber-800/80 bg-amber-950/20 text-amber-200 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-900/60 text-amber-300">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-2.5 py-1 rounded-full border border-amber-800">
                Low Confidence ({result.confidence}%)
              </span>
              <h3 className="text-base font-extrabold text-white mt-1">Diagnosis Uncertain</h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Crop</span>
            <p className="text-xs font-bold text-white">{result.cropName}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-900/40 space-y-2 text-xs leading-relaxed text-slate-300">
          <p className="font-semibold text-amber-300">⚠️ {result.treatmentGuidance.expertAdvice}</p>
          <p className="text-slate-400">
            FarmPilot AI strictly enforces confidence thresholds. We do not force a diagnosis when symptoms are ambiguous.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-amber-400" /> Expert Verification Recommended
          </span>
          <span className="font-semibold text-slate-300">Consult Extension Officer</span>
        </div>
      </div>
    );
  }

  // 3. HIGH & MEDIUM CONFIDENCE DIAGNOSTIC RESULT CARD
  const isMedium = result.confidenceLevel === 'MEDIUM';

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 bg-gradient-to-br from-slate-900 via-slate-900/95 to-farm-950/40 shadow-2xl">
      {/* Top Bar: Model Serving Status & Verification Tag */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-[11px]">
        <div className="flex items-center gap-2 text-slate-400">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Model: <strong className="text-slate-200">{result.modelId || 'farmpilot-crop-v1'}</strong> ({result.modelVersion || '1.0.0'})</span>
        </div>
        {result.isModelPending ? (
          <span className="bg-slate-800 text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-800/60">
            Model Pending Endpoint
          </span>
        ) : (
          <span className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-800">
            Model Active
          </span>
        )}
      </div>

      {/* Main Result Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              isMedium
                ? 'bg-amber-950 text-amber-300 border-amber-800'
                : 'bg-farm-950 text-farm-300 border-farm-800'
            }`}>
              {isMedium ? 'Diagnosis Likely' : 'High Confidence Diagnosis'}
            </span>
            {result.severity && (
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                result.severity === 'SEVERE'
                  ? 'bg-red-950 text-red-400 border border-red-800'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}>
                Severity: {result.severity}
              </span>
            )}
          </div>

          <h2 className="text-xl font-extrabold text-white mt-2">{result.detectedDisease}</h2>
          <p className="text-xs text-slate-400 mt-0.5">Crop Category: <strong className="text-slate-200">{result.cropName}</strong></p>
        </div>

        {/* Confidence Score Badge */}
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${
          isMedium
            ? 'bg-amber-950/50 border-amber-800/80 text-amber-300'
            : 'bg-farm-950/60 border-farm-700/80 text-farm-300'
        }`}>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Confidence</p>
            <p className="text-xl font-extrabold">{result.confidence}%</p>
          </div>
          {isMedium ? <AlertTriangle className="w-6 h-6 text-amber-400" /> : <CheckCircle2 className="w-6 h-6 text-farm-400" />}
        </div>
      </div>

      {/* Expert Verification Recommendation Banner for Medium Confidence */}
      {result.isExpertVerificationRecommended && (
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            <strong>Expert Notice:</strong> Confidence is {result.confidence}%. Local agricultural extension officer verification is recommended.
          </span>
        </div>
      )}

      {/* Immediate Actions List */}
      {result.immediateActions && result.immediateActions.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 space-y-2">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            Immediate Action Required
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-200 list-disc list-inside leading-relaxed">
            {result.immediateActions.map((act, idx) => (
              <li key={idx}>{act}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Symptoms & Causes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-2">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            Observed Symptoms
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside leading-relaxed">
            {result.symptoms.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-2">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-400" />
            Primary Causes & Favorable Conditions
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside leading-relaxed">
            {result.causes.map((c, idx) => (
              <li key={idx}>{c}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Integrated Pest Management (IPM) Guidance */}
      <div className="p-4 rounded-xl bg-farm-950/50 border border-farm-800/60 space-y-3">
        <h4 className="text-xs font-bold text-farm-300 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-farm-400" />
          Recommended Safe IPM Control & Prevention
        </h4>

        {result.treatmentGuidance.cultural.length > 0 && (
          <div className="text-xs space-y-1">
            <span className="font-semibold text-slate-200">🌱 Cultural Practices:</span>
            {result.treatmentGuidance.cultural.map((item, idx) => (
              <p key={idx} className="text-slate-300 pl-3 text-[11px] leading-relaxed">• {item}</p>
            ))}
          </div>
        )}

        {result.treatmentGuidance.sanitation.length > 0 && (
          <div className="text-xs space-y-1">
            <span className="font-semibold text-slate-200">🧹 Field Sanitation:</span>
            {result.treatmentGuidance.sanitation.map((item, idx) => (
              <p key={idx} className="text-slate-300 pl-3 text-[11px] leading-relaxed">• {item}</p>
            ))}
          </div>
        )}

        {result.treatmentGuidance.biological.length > 0 && (
          <div className="text-xs space-y-1">
            <span className="font-semibold text-slate-200">🧫 Biological Agents:</span>
            {result.treatmentGuidance.biological.map((item, idx) => (
              <p key={idx} className="text-slate-300 pl-3 text-[11px] leading-relaxed">• {item}</p>
            ))}
          </div>
        )}

        {/* Safety Disclaimer Notice */}
        <div className="mt-3 p-3 rounded-lg bg-slate-900/80 border border-amber-800/50 text-[11px] text-amber-300 leading-relaxed flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Chemical Safety Notice:</strong> FarmPilot AI provides safe non-prescriptive cultural IPM recommendations. Where chemical pesticides are considered, follow locally approved product labels and consult local agricultural extension officers.
          </span>
        </div>
      </div>
    </div>
  );
};
