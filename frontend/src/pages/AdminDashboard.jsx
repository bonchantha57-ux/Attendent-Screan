import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  Activity,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Plus,
  Monitor,
  FileSpreadsheet,
  Database,
  MapPin,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashboard({ onNavigate }) {
  const { lang, t } = useLanguage();
  const [metrics, setMetrics] = useState({
    totalRegistered: 0,
    presentToday: 0,
    absent: 0,
    lateArrivals: 0,
    attendanceRate: 0,
  });
  const [weeklyTrends, setWeeklyTrends] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardMetrics();
      if (res.success) {
        setMetrics(res.metrics);
        setWeeklyTrends(res.weeklyTrends || []);
        setRecentActivity(res.recentActivity || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const timer = setInterval(fetchDashboardData, 15000);
    return () => clearInterval(timer);
  }, []);

  // Bar Chart Data (Weekly Attendance Trends)
  const barChartData = {
    labels: weeklyTrends.map((w) => w.day.split(' ')[0]),
    datasets: [
      {
        label: lang === 'km' ? 'វត្តមាន (Present)' : 'Present',
        data: weeklyTrends.map((w) => w.present),
        backgroundColor: '#10b981',
        borderRadius: 8,
      },
      {
        label: lang === 'km' ? 'មកយឺត (Late)' : 'Late Arrivals',
        data: weeklyTrends.map((w) => w.late),
        backgroundColor: '#f59e0b',
        borderRadius: 8,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { size: 11, family: 'Kantumruy Pro' } },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: '#1e293b' },
        ticks: { color: '#94a3b8', font: { family: 'Kantumruy Pro' } },
      },
      y: {
        grid: { color: '#1e293b' },
        ticks: { color: '#94a3b8', stepSize: 1 },
        beginAtZero: true,
      },
    },
  };

  // Doughnut Chart Data (Today's Ratio)
  const doughnutData = {
    labels: [
      lang === 'km' ? 'វត្តមាន (Present)' : 'Present',
      lang === 'km' ? 'អវត្តមាន (Absent)' : 'Absent',
      lang === 'km' ? 'មកយឺត (Late)' : 'Late',
    ],
    datasets: [
      {
        data: [
          Math.max(0, metrics.presentToday - metrics.lateArrivals),
          metrics.absent,
          metrics.lateArrivals,
        ],
        backgroundColor: ['#10b981', '#f43f5e', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', font: { size: 11, family: 'Kantumruy Pro' } },
      },
    },
    cutout: '72%',
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Top Welcome Header & Quick Action Buttons */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                Admin Command Center
              </span>
              <span className="text-[11px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Firebase Live Sync
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lang === 'km' ? 'ផ្ទាំងគ្រប់គ្រងទិន្នន័យវត្តមាន' : 'Executive Attendance Dashboard'}
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'km'
                ? 'ត្រួតពិនិត្យវត្តមានបុគ្គលិក និងសិស្សតាមពេលវេលាជាក់ស្តែង (Real-time Sync)'
                : 'Real-time attendance monitor, scanning logs, and analytics'}
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => onNavigate('admin-map')}
              className="flex-1 md:flex-none px-3.5 py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-semibold rounded-2xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              title="Configure Campus Perimeter on Interactive Map"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'km' ? 'ផែនទី Geofence' : 'Geofence Map'}</span>
            </button>

            <button
              onClick={() => onNavigate('admin-users')}
              className="flex-1 md:flex-none px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'km' ? 'បន្ថែម User' : 'Add User'}</span>
            </button>

            <button
              onClick={() => onNavigate('admin-attendance')}
              className="flex-1 md:flex-none px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            >
              <Activity className="w-4 h-4 text-blue-400" />
              <span>{t('attendanceLogs')}</span>
            </button>

            <button
              onClick={() => onNavigate('admin-reports')}
              className="flex-1 md:flex-none px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{lang === 'km' ? 'របាយការណ៍' : 'Reports'}</span>
            </button>

            <button
              onClick={() => onNavigate('kiosk')}
              className="flex-1 md:flex-none px-3.5 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold rounded-2xl transition-all flex items-center justify-center gap-1.5 active:scale-95"
              title="Open Gate Entrance Screen"
            >
              <Monitor className="w-4 h-4 text-indigo-400" />
              <span>Screen QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards - Grid: 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Registered */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-medium text-slate-400">
              {t('totalRegistered')}
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Users className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-4xl font-extrabold text-white font-mono">
              {metrics.totalRegistered}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 block mt-1">
              {lang === 'km' ? 'បុគ្គលិក & សិស្សក្នុងប្រព័ន្ធ' : 'Registered Users'}
            </span>
          </div>
        </div>

        {/* Present Today */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-medium text-slate-400">
              {t('presentToday')}
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <UserCheck className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
              {metrics.presentToday}
            </span>
            <span className="text-[10px] sm:text-xs text-emerald-400/80 block mt-1 font-medium">
              {metrics.attendanceRate}% {lang === 'km' ? 'អត្រាវត្តមាន' : 'Rate'}
            </span>
          </div>
        </div>

        {/* Absent */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col justify-between hover:border-rose-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-medium text-slate-400">
              {t('absentToday')}
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <UserX className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-4xl font-extrabold text-rose-400 font-mono">
              {metrics.absent}
            </span>
            <span className="text-[10px] sm:text-xs text-rose-400/80 block mt-1 font-medium">
              {lang === 'km' ? 'មិនទាន់មាន Record Scan' : 'No scans today'}
            </span>
          </div>
        </div>

        {/* Late Arrivals */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col justify-between hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-medium text-slate-400">
              {t('lateArrivals')}
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-mono">
              {metrics.lateArrivals}
            </span>
            <span className="text-[10px] sm:text-xs text-amber-400/80 block mt-1 font-medium">
              {lang === 'km' ? 'ក្រោយ 08:30 AM' : 'After 08:30 AM'}
            </span>
          </div>
        </div>
      </div>

      {/* Analytical Charts: Weekly Trends + Today's Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Weekly Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm sm:text-base">
                {t('weeklyAttendanceChart')}
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">7 Days</span>
          </div>
          <div className="h-56 sm:h-64 w-full">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Today's Ratio Doughnut Chart */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-2">
            <h3 className="font-bold text-white text-sm sm:text-base">
              {lang === 'km' ? 'សមាមាត្រវត្តមានថ្ងៃនេះ' : "Today's Distribution"}
            </h3>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">Rate</span>
          </div>

          <div className="h-48 sm:h-56 w-full relative flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{metrics.attendanceRate}%</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Attended</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Scan Activity Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm sm:text-base">{t('liveScanFeed')}</h3>
          </div>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Scans
          </span>
        </div>

        {recentActivity.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs sm:text-sm">
            {lang === 'km' ? 'មិនទាន់មានការស្កេនក្នុងថ្ងៃនេះនៅឡើយទេ' : 'No scans recorded today yet'}
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {recentActivity.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 shrink-0">
                    {log.userName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-bold text-white truncate">{log.userName}</span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">({log.userId})</span>
                    </div>
                    <span className="text-[10px] text-slate-500 truncate block">{log.department}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                  <div className="text-right">
                    <span className="font-mono text-emerald-400 font-bold block">{log.checkIn}</span>
                    <span className="text-[9px] text-slate-500 font-mono hidden xs:block">
                      {log.distanceMeters !== undefined ? `${log.distanceMeters}m away` : 'Campus'}
                    </span>
                  </div>
                  <StatusBadge status={log.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
