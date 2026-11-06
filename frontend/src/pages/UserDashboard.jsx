import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import QRScannerModal from '../components/QRScannerModal';
import NotificationBanner from '../components/NotificationBanner';
import {
  Camera,
  Clock,
  Calendar,
  Building,
  UserCheck,
  CheckCircle2,
  LogIn,
  LogOut,
  MapPin,
  History,
  Sparkles,
  Database,
  Smartphone,
} from 'lucide-react';

export default function UserDashboard({ onOpenKiosk }) {
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  const [todayRecord, setTodayRecord] = useState(null);
  const [statusBadge, setStatusBadge] = useState('off_duty');
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock interval
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch status & history
  const fetchData = async () => {
    try {
      setLoading(true);
      const [statusRes, historyRes] = await Promise.all([
        api.getTodayStatus(),
        api.getMyHistory(),
      ]);

      if (statusRes.success) {
        setTodayRecord(statusRes.record);
        setStatusBadge(statusRes.statusBadge || 'off_duty');
      }

      if (historyRes.success) {
        setHistoryLogs(historyRes.attendance || []);
      }
    } catch (err) {
      console.error('Fetch user status error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScanSuccess = (scanResponse) => {
    if (scanResponse.record) {
      setTodayRecord(scanResponse.record);
      setStatusBadge(scanResponse.statusBadge || scanResponse.record.status);
    }
    fetchData();
  };

  const formattedDate = currentTime.toLocaleDateString(lang === 'km' ? 'km-KH' : 'en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedClock = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Web Push Notification Reminder Banner */}
      <NotificationBanner />

      {/* Hero: User Profile Card & Dynamic Digital Badge */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 sm:w-80 h-64 sm:h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 relative z-10">
          {/* User Details */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                {user?.role} Portal
              </span>
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" />
                {user?.userId}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              {lang === 'km' ? 'សួស្តី' : 'Welcome'}, {user?.name}!
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-300 font-khmer">
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{user?.department}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Status Badge (Off Duty, Working, Checked-Out) */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium md:mb-1.5 font-khmer">
              {lang === 'km' ? 'ស្ថានភាពវត្តមានផ្ទាល់៖' : 'Live Status:'}
            </span>
            <StatusBadge status={statusBadge} size="large" />
          </div>
        </div>
      </div>

      {/* Main Grid: Scan Action & Today's Metric Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Big Scan QR Action Card - Optimized for Phones */}
        <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col items-center justify-center text-center shadow-lg relative group">
          <div className="my-3 sm:my-5">
            <div className="relative inline-flex items-center justify-center">
              <span className="absolute w-28 sm:w-32 h-28 sm:h-32 rounded-full bg-emerald-500/20 animate-ping opacity-75" />
              <button
                onClick={() => setIsScannerOpen(true)}
                className="relative z-10 w-24 sm:w-28 h-24 sm:h-28 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-600 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/40 group-hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <Camera className="w-10 sm:w-12 h-10 sm:h-12" />
              </button>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white mb-1 font-khmer">
            {lang === 'km' ? 'ចុចទីនេះដើម្បី Scan QR វត្តមាន' : 'Tap to Scan Attendance QR'}
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mb-5 font-khmer leading-relaxed">
            {statusBadge === 'off_duty'
              ? lang === 'km'
                ? 'Scan In នៅពេលមកដល់ ដើម្បីកត់ត្រាម៉ោង Check-in'
                : 'Scan In upon arrival to mark your check-in time'
              : statusBadge === 'working'
              ? lang === 'km'
                ? 'Scan Out នៅចុងម៉ោង ដើម្បីគណនាម៉ោងធ្វើការសរុប'
                : 'Scan Out at end-of-shift to calculate total hours'
              : lang === 'km'
              ? 'អ្នកបាន Scan រួចរាល់សម្រាប់ថ្ងៃនេះ'
              : "You have completed today's attendance"}
          </p>

          <button
            onClick={() => setIsScannerOpen(true)}
            className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm font-khmer"
          >
            <Camera className="w-4 h-4" />
            <span>{t('scanInBtn')}</span>
          </button>

          {/* Quick link to entrance screen */}
          {onOpenKiosk && (
            <button
              onClick={onOpenKiosk}
              className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 hover:underline transition-colors font-khmer"
            >
              📺 {lang === 'km' ? 'បើកមើល Screen QR មាត់ទ្វារ' : 'View Entrance Kiosk Screen'}
            </button>
          )}
        </div>

        {/* Right Column: Today's Record Timeline Details */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm sm:text-base font-khmer">
                  {lang === 'km' ? 'កំណត់ត្រាវត្តមានថ្ងៃនេះ' : "Today's Attendance Timeline"}
                </h3>
              </div>
              <div className="px-2.5 sm:px-3 py-1 bg-slate-950 rounded-xl text-xs sm:text-sm font-mono font-bold text-emerald-400 border border-slate-800">
                {formattedClock}
              </div>
            </div>

            {/* Check-in, Check-out & Hours Cards */}
            <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 mb-5">
              {/* Check-in */}
              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 flex flex-col">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5 font-khmer">
                  <span>{t('checkInTime')}</span>
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-lg sm:text-xl font-mono font-extrabold text-white">
                  {todayRecord?.checkIn || '--:--'}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 font-khmer">
                  {todayRecord?.checkIn ? 'Scan បានជោគជ័យ' : 'មិនទាន់ Scan'}
                </span>
              </div>

              {/* Check-out */}
              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 flex flex-col">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5 font-khmer">
                  <span>{t('checkOutTime')}</span>
                  <LogOut className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span className="text-lg sm:text-xl font-mono font-extrabold text-white">
                  {todayRecord?.checkOut || '--:--'}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 font-khmer">
                  {todayRecord?.checkOut ? 'ចេញរួចរាល់' : 'រង់ចាំ Scan ចេញ'}
                </span>
              </div>

              {/* Total Hours */}
              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 flex flex-col">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5 font-khmer">
                  <span>{t('totalWorkHours')}</span>
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-sm sm:text-base font-bold text-amber-400 truncate font-khmer">
                  {todayRecord?.totalHours || '0 ម៉ោង'}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 font-khmer">
                  {todayRecord?.status === 'working' ? 'កំពុងរាប់ម៉ោង (Active)' : 'សរុបប្រចាំថ្ងៃ'}
                </span>
              </div>
            </div>

            {/* Geofence & Device Security verification */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-khmer">
                  {lang === 'km' ? 'សុវត្ថិភាពទីតាំង (Geofence):' : 'Geofence Verification:'}{' '}
                  <strong className="text-white font-mono">
                    {todayRecord?.distanceMeters !== undefined
                      ? `${todayRecord.distanceMeters}m ក្នុងបរិវេណ`
                      : 'Campus Perimeter Verified'}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-400 font-khmer">
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  {lang === 'km' ? 'ឧបករណ៍៖ ' : 'Device: '}
                  <span className="text-slate-200 font-semibold">{todayRecord?.device?.slice(0, 24) || 'Phone Web Camera'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance History Section - Responsive Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <History className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm sm:text-base font-khmer">{t('recentHistory')}</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {historyLogs.length} records
          </span>
        </div>

        {historyLogs.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-xs sm:text-sm font-khmer">
            {lang === 'km' ? 'មិនទាន់មានប្រវត្តិកត់ត្រាវត្តមាននៅឡើយទេ' : 'No attendance logs recorded yet'}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3 sm:px-4 font-khmer">កាលបរិច្ឆេទ</th>
                    <th className="py-3 px-3 sm:px-4 font-khmer">ម៉ោងចូល</th>
                    <th className="py-3 px-3 sm:px-4 font-khmer">ម៉ោងចេញ</th>
                    <th className="py-3 px-3 sm:px-4 font-khmer">ម៉ោងសរុប</th>
                    <th className="py-3 px-3 sm:px-4 font-khmer">ស្ថានភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {historyLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 sm:px-4 font-mono font-medium text-white">{log.date}</td>
                      <td className="py-3 px-3 sm:px-4 font-mono font-bold text-emerald-400">{log.checkIn || '-'}</td>
                      <td className="py-3 px-3 sm:px-4 font-mono font-bold text-blue-400">{log.checkOut || '-'}</td>
                      <td className="py-3 px-3 sm:px-4 text-slate-300 font-khmer">{log.totalHours || '-'}</td>
                      <td className="py-3 px-3 sm:px-4">
                        <StatusBadge status={log.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Action for Phones */}
      <div className="sm:hidden fixed bottom-4 inset-x-4 z-30">
        <button
          onClick={() => setIsScannerOpen(true)}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 active:scale-[0.98] text-slate-950 font-extrabold rounded-2xl shadow-2xl shadow-emerald-500/40 flex items-center justify-center gap-2 text-sm font-khmer border border-emerald-400/30"
        >
          <Camera className="w-5 h-5" />
          <span>{lang === 'km' ? 'ចុច Scan QR វត្តមានឥឡូវនេះ' : 'Tap to Scan QR'}</span>
        </button>
      </div>

      {/* Camera QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
}
