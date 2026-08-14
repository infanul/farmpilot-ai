'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiClient } from '../../lib/apiClient';
import { NotificationItem } from '../../types';
import { Bell, LogOut, Menu, X, Leaf, Sun, Moon, Globe } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      apiClient.get<NotificationItem[]>('/notifications')
        .then(setNotifications)
        .catch(() => setNotifications([]));
    }
  }, [user]);

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter((n) => n && !n.isRead).length;
  const userName = user?.name || 'Farmer';
  const avatarInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 bg-slate-900/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
          <Link
            href="/dashboard"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/dashboard' ? 'bg-farm-600/30 text-farm-300 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t('nav_dashboard')}
          </Link>
          <Link
            href="/crops"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname?.startsWith('/crops') ? 'bg-farm-600/30 text-farm-300 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t('nav_crops')}
          </Link>
          <Link
            href="/calendar"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/calendar' ? 'bg-farm-600/30 text-farm-300 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t('nav_calendar')}
          </Link>
          <Link
            href="/disease-scanner"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              pathname === '/disease-scanner' ? 'bg-farm-600/30 text-farm-300 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Leaf className="w-4 h-4 text-emerald-400" />
            {t('nav_scanner')}
          </Link>
          <Link
            href="/weather"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/weather' ? 'bg-farm-600/30 text-farm-300 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t('nav_weather')}
          </Link>
          <Link
            href="/soil"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/soil' ? 'bg-farm-600/30 text-farm-300 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t('nav_soil')}
          </Link>
          <Link
            href="/market"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/market' ? 'bg-farm-600/30 text-farm-300 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t('nav_market')}
          </Link>
        </nav>

        {/* Controls: Language Switcher, Theme Toggle, User Session */}
        <div className="flex items-center space-x-2.5">
          {/* Language Switcher */}
          <div className="relative flex items-center bg-slate-800/80 border border-slate-700/60 rounded-xl px-2 py-1 text-xs font-semibold text-slate-300">
            <Globe className="w-3.5 h-3.5 mr-1.5 text-farm-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'ml')}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="en" className="bg-slate-900 text-white">English</option>
              <option value="ml" className="bg-slate-900 text-white">മലയാളം</option>
            </select>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-amber-400 hover:bg-slate-700 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {user ? (
            <>
              {/* Notification Popover */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                      <h4 className="text-sm font-semibold text-white">Notifications</h4>
                      <span className="text-xs text-farm-400 bg-farm-950 px-2 py-0.5 rounded-full border border-farm-800">
                        {unreadCount} unread
                      </span>
                    </div>
                    <div className="space-y-2.5 max-h-64 overflow-y-auto">
                      {safeNotifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-3">No notifications yet.</p>
                      ) : (
                        safeNotifications.slice(0, 4).map((n) => (
                          <div key={n.id} className="p-2.5 bg-slate-800/60 rounded-xl text-xs border border-slate-700/50">
                            <p className="font-semibold text-slate-200">{n.title}</p>
                            <p className="text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              <Link
                href="/profile"
                className="flex items-center gap-2 p-1.5 rounded-xl text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-farm-600 flex items-center justify-center text-white font-semibold text-xs border border-farm-400">
                  {avatarInitial}
                </div>
                <span className="hidden lg:inline text-xs font-medium text-slate-200">{userName}</span>
              </Link>

              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-800 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-farm-600 hover:bg-farm-500 rounded-xl shadow-md shadow-farm-900/30 transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 px-4 pt-3 pb-6 space-y-2">
          <Link href="/dashboard" className="block px-3 py-2 rounded-xl text-sm text-slate-200 hover:bg-slate-800">
            {t('nav_dashboard')}
          </Link>
          <Link href="/crops" className="block px-3 py-2 rounded-xl text-sm text-slate-200 hover:bg-slate-800">
            {t('nav_crops')}
          </Link>
          <Link href="/calendar" className="block px-3 py-2 rounded-xl text-sm text-slate-200 hover:bg-slate-800">
            {t('nav_calendar')}
          </Link>
          <Link href="/disease-scanner" className="block px-3 py-2 rounded-xl text-sm text-slate-200 hover:bg-slate-800">
            {t('nav_scanner')}
          </Link>
          <Link href="/weather" className="block px-3 py-2 rounded-xl text-sm text-slate-200 hover:bg-slate-800">
            {t('nav_weather')}
          </Link>
          <Link href="/soil" className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800">
            {t('nav_soil')}
          </Link>
          <Link href="/market" className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800">
            {t('nav_market')}
          </Link>
        </div>
      )}
    </header>
  );
};
