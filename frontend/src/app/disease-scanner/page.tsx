'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { ImageUploader } from '../../components/disease/ImageUploader';
import { ScanResultsCard } from '../../components/disease/ScanResultsCard';
import { apiClient } from '../../lib/apiClient';
import { DiseaseScanResult } from '../../types';
import { Leaf, Cpu, History, Calendar, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DiseaseScannerPage() {
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<DiseaseScanResult | null>(null);
  const [history, setHistory] = useState<DiseaseScanResult[]>([]);
  const [error, setError] = useState('');

  const loadScanHistory = async () => {
    if (!user) return;
    try {
      const data = await apiClient.get<DiseaseScanResult[]>('/disease/scans');
      setHistory(data);
    } catch (err) {
      console.warn('Scan history load note:', err);
    }
  };

  useEffect(() => {
    loadScanHistory();
  }, [user]);

  const handleScanImage = async (file: File, cropHint?: string) => {
    setIsScanning(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);
    if (cropHint) formData.append('cropHint', cropHint);

    try {
      const data = await apiClient.post<DiseaseScanResult>('/disease/scan', formData);
      setScanResult(data);
      loadScanHistory();
    } catch (err: any) {
      setError(err.message || 'Failed to analyze crop image. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      <Sidebar />

      <div className="flex-1 min-w-0 space-y-6">
        {/* Header Hero */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-farm-950/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-farm-950 text-farm-300 text-xs font-bold border border-farm-800">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Model Serving Pipeline (Rice, Tomato, Chilli)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              AI Crop Disease Scanner
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Upload a clear leaf photo for instant crop identification, disease diagnosis, confidence scoring, and safe IPM treatment.
            </p>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-right flex-shrink-0">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Model Interface</span>
            <span className="text-xs font-bold text-farm-400">farmpilot-crop-v1 (1.0.0)</span>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-800 text-red-200 text-xs">
            ⚠️ {error}
          </div>
        )}

        {/* Main Grid: Upload & Diagnostic Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <ImageUploader onScan={handleScanImage} isScanning={isScanning} />

          <div>
            {scanResult ? (
              <ScanResultsCard result={scanResult} />
            ) : (
              <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center text-slate-400 space-y-4 shadow-xl">
                <Cpu className="w-12 h-12 mx-auto text-slate-600 animate-pulse" />
                <h3 className="text-base font-bold text-white">Ready for Leaf Diagnosis</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Upload a photo of a leaf showing dark spots, leaf yellowing, or wilt. FarmPilot AI will validate image quality and process inference.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Farmer Saved Scan History Section */}
        {user && history.length > 0 && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-farm-400" />
              Farmer Saved Disease Scan History ({history.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((item) => {
                const isRejected = item.confidenceLevel === 'REJECTED';
                const isLow = item.isLowConfidence || item.confidenceLevel === 'LOW';

                return (
                  <div
                    key={item.id}
                    onClick={() => setScanResult(item)}
                    className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-farm-600/50 cursor-pointer transition-all hover:-translate-y-0.5 space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {item.cropName}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        isRejected
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : isLow
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-farm-950 text-farm-300 border border-farm-800'
                      }`}>
                        {isRejected ? <XCircle className="w-3 h-3" /> : isLow ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {isRejected ? 'Rejected' : `${item.confidence}%`}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-farm-300 transition-colors">
                      {item.detectedDisease}
                    </h4>

                    {item.createdAt && (
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
