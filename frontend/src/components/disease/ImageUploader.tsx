'use client';

import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, RefreshCw, AlertCircle, Info } from 'lucide-react';

interface ImageUploaderProps {
  onScan: (file: File, cropHint?: string) => void;
  isScanning: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onScan, isScanning }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropHint, setCropHint] = useState<string>('Rice');
  const [preValidationWarning, setPreValidationWarning] = useState<string | null>(null);

  const processFile = (file: File) => {
    setPreValidationWarning(null);

    if (file.size < 5000) {
      setPreValidationWarning('File size is under 5 KB. Image may be too low resolution or corrupt for disease scanning.');
    } else if (file.size > 10 * 1024 * 1024) {
      setPreValidationWarning('File size exceeds 10 MB. Please upload a smaller compressed image.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleScanSubmit = () => {
    if (selectedFile) {
      onScan(selectedFile, cropHint);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-farm-400" />
          Leaf Image Upload & Pre-Validation
        </h3>
        <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
          Supported: Rice, Tomato, Chilli
        </span>
      </div>

      {/* Select Target Crop Category */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Select Target Crop Category
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'Rice', label: '🌾 Rice (Paddy)' },
            { id: 'Tomato', label: '🍅 Tomato' },
            { id: 'Chilli', label: '🌶️ Chilli' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCropHint(item.id)}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                cropHint === item.id
                  ? 'bg-farm-950 border-farm-500 text-farm-300 shadow-md'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pre-validation Warning */}
      {preValidationWarning && (
        <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-200 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>{preValidationWarning}</span>
        </div>
      )}

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-slate-700 hover:border-farm-500/60 rounded-2xl p-6 text-center bg-slate-900/50 transition-colors cursor-pointer group"
      >
        <input
          type="file"
          accept="image/*"
          id="leaf-image-input"
          onChange={handleFileChange}
          className="hidden"
        />

        {previewUrl ? (
          <div className="space-y-3">
            <div className="relative w-48 h-48 mx-auto rounded-xl overflow-hidden border-2 border-farm-500 shadow-xl">
              <img src={previewUrl} alt="Leaf Preview" className="w-full h-full object-cover" />
            </div>
            <label
              htmlFor="leaf-image-input"
              className="inline-flex items-center gap-1.5 text-xs text-farm-400 hover:underline cursor-pointer font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Choose Different Photo
            </label>
          </div>
        ) : (
          <label htmlFor="leaf-image-input" className="cursor-pointer block space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 group-hover:bg-farm-900/40 text-farm-400 flex items-center justify-center transition-colors">
              <ImageIcon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Click or Drag & Drop single leaf photo</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP in natural daylight up to 10MB</p>
            </div>
          </label>
        )}
      </div>

      {/* Quality Guidance Note */}
      <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
        <Info className="w-4 h-4 text-farm-400 flex-shrink-0" />
        <span>
          <strong>Tip for High Confidence:</strong> Photograph a single leaf directly in ambient sunlight. Avoid blurry motion or shadows.
        </span>
      </div>

      {/* Action Button */}
      <button
        disabled={!selectedFile || isScanning}
        onClick={handleScanSubmit}
        className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
          !selectedFile || isScanning
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            : 'bg-gradient-to-r from-farm-600 to-emerald-600 hover:from-farm-500 hover:to-emerald-500 text-white shadow-farm-900/40 hover:scale-[1.01]'
        }`}
      >
        {isScanning ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
            <span>Analyzing Image Quality & ML Model Inference...</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Scan Leaf Image with AI</span>
          </>
        )}
      </button>
    </div>
  );
};
