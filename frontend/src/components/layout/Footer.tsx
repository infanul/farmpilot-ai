'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../ui/Logo';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  if (!pathname || pathname === '/' || pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <footer className="w-full glass-panel border-t border-slate-800 bg-slate-950 text-slate-400 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-1">
            <Logo size="md" />
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Smarter Decisions. Healthier Crops. Better Harvests.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Core Modules</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/weather" className="hover:text-farm-400 transition-colors">Weather Intelligence</Link>
              </li>
              <li>
                <Link href="/crops" className="hover:text-farm-400 transition-colors">Crop Library & Guides</Link>
              </li>
              <li>
                <Link href="/calendar" className="hover:text-farm-400 transition-colors">Smart Crop Calendar</Link>
              </li>
              <li>
                <Link href="/disease-scanner" className="hover:text-farm-400 transition-colors">AI Disease Scanner</Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Analytics & Farm</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/soil" className="hover:text-farm-400 transition-colors">Soil Intelligence</Link>
              </li>
              <li>
                <Link href="/market" className="hover:text-farm-400 transition-colors">Market Tracking</Link>
              </li>
              <li>
                <Link href="/advisor" className="hover:text-farm-400 transition-colors">Farming Advisor</Link>
              </li>
              <li>
                <Link href="/finance" className="hover:text-farm-400 transition-colors">Expense Tracking</Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">FarmPilot AI Support</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed specifically for real farmers. Non-prescriptive, safe agricultural guidance.
            </p>
            <div className="mt-3 inline-block px-2.5 py-1 rounded-md bg-farm-950 border border-farm-800 text-[11px] text-farm-300">
              🌱 Version 1.0 Production
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FarmPilot AI. All rights reserved.</p>
          <div className="flex gap-4 mt-3 sm:mt-0">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
