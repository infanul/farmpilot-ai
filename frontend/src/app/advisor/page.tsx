'use client';

import React, { useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { apiClient } from '../../lib/apiClient';
import { HelpCircle, Send, Sparkles, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

export default function AdvisorPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [adviceResult, setAdviceResult] = useState<any | null>(null);

  const presetQuestions = [
    'My tomato leaves are turning yellow. What should I do?',
    'What should I do before heavy rain is expected?',
    'When and how should I irrigate my rice crop?',
    'How do I prevent fungal disease during monsoon?',
  ];

  const handleAsk = async (qText: string) => {
    setLoading(true);
    setAdviceResult(null);
    try {
      const data = await apiClient.post<any>('/advisor', { question: qText });
      setAdviceResult(data);
    } catch (err) {
      console.error('Failed to query advisor:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      <Sidebar />

      <div className="flex-1 min-w-0 space-y-6">
        {/* Header */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-farm-950/60 shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-farm-400 bg-farm-950 px-3 py-1 rounded-full border border-farm-800">
            Agronomic AI Consultation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-emerald-400" />
            Farming Advisor
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Ask practical day-to-day farming questions and receive structured, safe agricultural guidance.
          </p>
        </div>

        {/* Preset Questions Bar */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Common Farmer Queries</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {presetQuestions.map((pq, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuestion(pq);
                  handleAsk(pq);
                }}
                className="p-3 text-left rounded-xl bg-slate-900/60 hover:bg-farm-950/60 border border-slate-800 hover:border-farm-700/60 text-xs text-slate-200 font-medium transition-all flex items-center justify-between group"
              >
                <span>{pq}</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-farm-400 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Query Form */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900 flex items-center gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your agricultural question here... (e.g. How to prepare soil for tomato planting?)"
            className="flex-1 bg-transparent text-xs text-white outline-none px-2"
          />
          <button
            disabled={!question || loading}
            onClick={() => handleAsk(question)}
            className="px-4 py-2.5 rounded-xl bg-farm-600 hover:bg-farm-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Ask Advisor</span>
          </button>
        </div>

        {/* Advice Output */}
        {adviceResult && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 space-y-5 shadow-2xl">
            <div className="pb-3 border-b border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-farm-400 bg-farm-950 px-2.5 py-0.5 rounded-full border border-farm-800">
                Advisory Response
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{adviceResult.summary}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Query: "{adviceResult.question}"</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-farm-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-farm-400" />
                Actionable Recommendations
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside bg-slate-950/60 p-4 rounded-2xl border border-slate-800 leading-relaxed">
                {adviceResult.recommendations.map((r: string, idx: number) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Important Precautions
              </h4>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 leading-relaxed">
                {adviceResult.precautions.map((p: string, idx: number) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-farm-950/40 border border-farm-800/60 text-xs text-slate-300 space-y-1">
              <p className="font-bold text-farm-300">🌱 Suggested Next Steps:</p>
              {adviceResult.nextSteps.map((ns: string, idx: number) => (
                <p key={idx} className="pl-3 text-[11px]">• {ns}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
