'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/apiClient';
import { Expense } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { DollarSign, Plus, TrendingUp, PieChart, Info, ShieldCheck } from 'lucide-react';

export default function FinancePage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState<{ category: string; amount: number }[]>([]);
  const [projections, setProjections] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    category: 'Fertilizer',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  const fetchFinanceData = () => {
    setLoading(true);
    apiClient
      .get<any>('/finance')
      .then((data) => {
        setExpenses(data.expenses);
        setTotalExpenses(data.totalExpenses);
        setCategoryBreakdown(data.categoryBreakdown);
        setProjections(data.projections);
      })
      .catch((err) => console.error('Failed to load finance data:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFinanceData();
  }, [user]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount) return;
    try {
      await apiClient.post('/finance', form);
      setShowModal(false);
      setForm({ category: 'Fertilizer', description: '', amount: '', date: new Date().toISOString().split('T')[0] });
      fetchFinanceData();
    } catch (err) {
      console.error('Failed to log expense:', err);
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      <Sidebar />

      <div className="flex-1 min-w-0 space-y-6">
        {/* Header */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-farm-950/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-farm-400 bg-farm-950 px-3 py-1 rounded-full border border-farm-800">
              Agronomic Financial Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 flex items-center gap-2">
              <DollarSign className="w-7 h-7 text-emerald-400" />
              Expense & Revenue Tracking
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Record farming expenses and track estimated harvest revenue and profit margins.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-farm-600 to-emerald-600 hover:from-farm-500 hover:to-emerald-500 shadow-md flex items-center gap-2 hover:scale-105 transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Record Farm Expense</span>
          </button>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
            <p className="text-xs text-slate-400 font-semibold uppercase">Total Farm Expenses</p>
            <p className="text-2xl font-extrabold text-red-400 mt-1">{formatCurrency(totalExpenses)}</p>
            <p className="text-[11px] text-slate-400 mt-1">{expenses.length} Logged Entries</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
            <p className="text-xs text-slate-400 font-semibold uppercase">Estimated Harvest Revenue</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">
              {formatCurrency(projections?.estimatedRevenue || 155250)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Based on target yield & mandi prices</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
            <p className="text-xs text-slate-400 font-semibold uppercase">Estimated Net Profit</p>
            <p className="text-2xl font-extrabold text-farm-300 mt-1">
              {formatCurrency(projections?.estimatedProfit || 138150)}
            </p>
            <p className="text-[11px] text-emerald-400 font-bold mt-1">
              {projections?.profitMarginPercentage || 89}% Estimated Margin
            </p>
          </div>
        </div>

        {/* Estimation Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-farm-400 flex-shrink-0" />
          <span>
            <strong>Note on Projections:</strong> Revenue and profit figures are estimated based on your target crop yield and current local market mandi prices.
          </span>
        </div>

        {/* Category Breakdown & Expense History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Breakdown (1 col) */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-400" />
              Expense Distribution
            </h3>
            <div className="space-y-3">
              {categoryBreakdown.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{item.category}</span>
                  <span className="font-bold text-white">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expense Log History (2 cols) */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Recent Expenditure History</h3>

            <div className="space-y-3">
              {expenses.map((exp) => (
                <div key={exp.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{exp.category}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-farm-300 border border-slate-700">
                        {formatDate(exp.date)}
                      </span>
                    </div>
                    <p className="text-slate-400 mt-1">{exp.description}</p>
                  </div>
                  <span className="text-sm font-extrabold text-red-400">{formatCurrency(exp.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Expense Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900 max-w-md w-full space-y-4">
              <h3 className="text-lg font-bold text-white">Record Farm Expense</h3>
              <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Expense Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  >
                    <option value="Seeds">Seeds</option>
                    <option value="Fertilizer">Fertilizer</option>
                    <option value="Irrigation">Irrigation</option>
                    <option value="Labour">Labour</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Transport">Transport</option>
                    <option value="Pest management">Pest management</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hybrid Basmati seeds 20kg"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Amount (INR)</label>
                  <input
                    type="number"
                    required
                    placeholder="3200"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-farm-600 hover:bg-farm-500 rounded-xl shadow-md"
                  >
                    Save Expense
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
