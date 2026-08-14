'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sprout,
  Calendar,
  Scan,
  CloudSun,
  TestTube,
  TrendingUp,
  HelpCircle,
  BarChart3,
  DollarSign,
  Home,
  User,
  ChevronRight,
  Pin,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scrolledFar, setScrolledFar] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY > 100) {
            setScrolledFar(true);
          } else {
            setScrolledFar(false);
          }

          if (!isPinned) {
            // Scroll Down -> Gracefully slide away sidebar to free up space
            if (currentScrollY > lastScrollYRef.current && currentScrollY > 120) {
              setIsVisible(false);
            } 
            // Scroll Up or Near Top -> Reappear with soft transition
            else if (currentScrollY < lastScrollYRef.current || currentScrollY < 40) {
              setIsVisible(true);
            }
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPinned]);

  const showSidebar = isVisible || isPinned || isHovered;

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Farms', href: '/farms', icon: Home },
    { name: 'Crops Catalog', href: '/crops', icon: Sprout },
    { name: 'Smart Calendar', href: '/calendar', icon: Calendar },
    { name: 'AI Disease Scanner', href: '/disease-scanner', icon: Scan, badge: 'AI' },
    { name: 'Live Weather', href: '/weather', icon: CloudSun },
    { name: 'Soil Intelligence', href: '/soil', icon: TestTube },
    { name: 'Market Prices', href: '/market', icon: TrendingUp },
    { name: 'Farming Advisor', href: '/advisor', icon: HelpCircle },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Finance & Expenses', href: '/finance', icon: DollarSign },
    { name: 'Profile & Settings', href: '/profile', icon: User },
  ];

  return (
    <>
      {/* Floating Antigravity Trigger Pill (Appears when sidebar slides away on scroll down) */}
      {!showSidebar && scrolledFar && (
        <div className="fixed top-24 left-4 z-40 hidden lg:flex items-center">
          <button
            onClick={() => setIsVisible(true)}
            onMouseEnter={() => setIsHovered(true)}
            className="group px-3 py-2.5 rounded-2xl glass-panel border border-farm-500/50 bg-slate-900/90 text-farm-300 text-xs font-bold shadow-2xl shadow-farm-950/80 hover:border-farm-400 hover:scale-105 transition-all duration-300 flex items-center gap-2 backdrop-blur-xl animate-pulse"
            title="Expand Antigravity Navigation"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="hidden group-hover:inline text-slate-100 font-semibold transition-opacity duration-300">
              Floating Nav
            </span>
            <ChevronRight className="w-4 h-4 text-farm-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* Main Floating Antigravity Sidebar (Self-contained h-fit, ending cleanly after last item) */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-64 h-fit self-start glass-panel border border-slate-800/80 bg-slate-900/95 hidden lg:block flex-shrink-0 p-4 rounded-3xl sticky top-20 z-30 transition-all duration-500 ease-out shadow-2xl ${
          showSidebar
            ? 'translate-x-0 opacity-100 scale-100 shadow-[0_10px_35px_-5px_rgba(5,46,22,0.4)]'
            : '-translate-x-full opacity-0 pointer-events-none scale-95'
        }`}
      >
        {/* Antigravity Toolbar Header */}
        <div className="flex items-center justify-between px-3 mb-3 pb-2.5 border-b border-slate-800/80">
          <span className="text-[11px] font-extrabold text-farm-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            Farming Operations
          </span>
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              isPinned
                ? 'bg-farm-950 text-farm-300 border border-farm-700'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
            title={isPinned ? 'Unpin (Auto-slide on scroll)' : 'Pin Sidebar Always Visible'}
          >
            <Pin className={`w-3.5 h-3.5 ${isPinned ? 'rotate-45 text-emerald-400' : ''}`} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-farm-700/60 via-farm-800/50 to-emerald-900/40 text-farm-300 font-bold border border-farm-500/50 shadow-lg shadow-farm-950/50 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70 hover:translate-x-1'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-md border border-emerald-500/40">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Subtle Bottom Closure Gradient & Status Footer */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 px-2.5 bg-gradient-to-b from-transparent to-slate-950/40 rounded-b-2xl">
          <span className="flex items-center gap-1.5 font-medium text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
            System Online
          </span>
          <span className="text-[10px] font-bold text-farm-300 bg-farm-950/80 px-2 py-0.5 rounded-full border border-farm-800/60">
            v1.0.0
          </span>
        </div>
      </aside>
    </>
  );
};
