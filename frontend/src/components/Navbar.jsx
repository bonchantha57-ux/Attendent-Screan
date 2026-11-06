import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  QrCode,
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  FileCheck2,
  LogOut,
  Globe,
  Menu,
  X,
  Shield,
  Monitor,
  User,
  Camera,
  MapPin,
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout, isAdmin } = useAuth();
  const { lang, toggleLang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = isAdmin
    ? [
        { id: 'admin-dash', label: lang === 'km' ? 'ផ្ទាំងគ្រប់គ្រង' : 'Dashboard', icon: LayoutDashboard },
        { id: 'admin-map', label: lang === 'km' ? 'ផែនទី Geofence' : 'Geofence Map', icon: MapPin, highlight: true },
        { id: 'admin-users', label: lang === 'km' ? 'អ្នកប្រើប្រាស់' : 'Users', icon: Users },
        { id: 'admin-attendance', label: lang === 'km' ? 'កំណត់ត្រា' : 'Logs', icon: FileCheck2 },
        { id: 'admin-reports', label: lang === 'km' ? 'របាយការណ៍' : 'Reports', icon: FileSpreadsheet },
        { id: 'kiosk', label: lang === 'km' ? 'Screen QR' : 'Gate Screen', icon: Monitor },
        { id: 'user-dash', label: lang === 'km' ? 'ស្កេន' : 'Scan', icon: Camera },
      ]
    : [
        { id: 'user-dash', label: lang === 'km' ? 'ទំព័រដើម' : 'Dashboard', icon: LayoutDashboard },
        { id: 'kiosk', label: lang === 'km' ? 'Screen QR មាត់ទ្វារ' : 'Gate QR', icon: Monitor, highlight: true },
      ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/90">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer"
            onClick={() => setActiveTab(isAdmin ? 'admin-dash' : 'user-dash')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <QrCode className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-white text-sm sm:text-base tracking-tight font-sans">
                  ATTENDANCE<span className="text-emerald-400">.LIVE</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <span className="text-[10px] text-slate-400 font-khmer">
                {lang === 'km' ? 'ប្រព័ន្ធគ្រប់គ្រងវត្តមានឆ្លាតវៃ' : 'Universal Attendance System'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-semibold transition-all font-khmer ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/25'
                      : item.highlight
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Language + Profile + Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'km' ? '🇰🇭 ខ្មែរ' : '🇬🇧 EN'}</span>
            </button>

            {/* User Profile Pill */}
            {user && (
              <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white leading-none truncate max-w-[120px]">{user.name}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase font-mono ${
                        user.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : user.role === 'staff'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">{user.userId}</span>
                </div>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
