import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import KioskScreen from './pages/KioskScreen';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminAttendance from './pages/AdminAttendance';
import AdminReports from './pages/AdminReports';
import AdminGeofenceMap from './pages/AdminGeofenceMap';
import { LayoutDashboard, Users, FileCheck2, FileSpreadsheet, Monitor, UserCheck, MapPin } from 'lucide-react';

function MainApp() {
  const { user, isAuthenticated, loading, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [activeTab, setActiveTab] = useState('admin-dash');

  // Set default tab when auth changes
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        setActiveTab('admin-dash');
      } else {
        setActiveTab('user-dash');
      }
    }
  }, [isAuthenticated, isAdmin]);

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((reg) => console.log('Service Worker registered:', reg.scope))
        .catch((err) => console.warn('SW registration err:', err));
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Loading Attendance System...</span>
        </div>
      </div>
    );
  }

  // Allow viewing Kiosk Screen directly even if logged out (for entrance monitors!)
  if (!isAuthenticated && activeTab !== 'kiosk') {
    if (authView === 'register') {
      return (
        <Register
          onSwitchToLogin={() => setAuthView('login')}
          onRegisterSuccess={() => setActiveTab(isAdmin ? 'admin-dash' : 'user-dash')}
        />
      );
    }
    return (
      <Login
        onSwitchToRegister={() => setAuthView('register')}
        onLoginSuccess={() => setActiveTab(isAdmin ? 'admin-dash' : 'user-dash')}
      />
    );
  }

  const mobileNavItems = isAdmin
    ? [
        { id: 'admin-dash', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'admin-map', label: 'Map', icon: MapPin },
        { id: 'admin-users', label: 'Users', icon: Users },
        { id: 'admin-attendance', label: 'Logs', icon: FileCheck2 },
        { id: 'admin-reports', label: 'Reports', icon: FileSpreadsheet },
      ]
    : [
        { id: 'user-dash', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'kiosk', label: 'Gate QR', icon: Monitor },
      ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-20 sm:pb-0">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 pb-8 sm:pb-12">
        {activeTab === 'user-dash' && (
          <UserDashboard onOpenKiosk={() => setActiveTab('kiosk')} />
        )}

        {activeTab === 'kiosk' && <KioskScreen />}

        {isAdmin && activeTab === 'admin-dash' && (
          <AdminDashboard onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {isAdmin && activeTab === 'admin-map' && <AdminGeofenceMap />}

        {isAdmin && activeTab === 'admin-users' && <AdminUsers />}

        {isAdmin && activeTab === 'admin-attendance' && <AdminAttendance />}

        {isAdmin && activeTab === 'admin-reports' && <AdminReports />}
      </main>

      {/* Mobile Phone Bottom Navigation Bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 safe-bottom">
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center h-full transition-all ${
                  isActive ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="hidden sm:block border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500 font-khmer">
        Universal Web-Based Attendance Tracking System • Powered by Firebase & Antigravity
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </AuthProvider>
  );
}
