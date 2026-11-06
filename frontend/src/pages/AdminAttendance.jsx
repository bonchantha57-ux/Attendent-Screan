import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import {
  FileCheck2,
  Calendar,
  Search,
  Filter,
  CheckCircle,
  Clock,
  MapPin,
  X,
  FileEdit,
  User,
} from 'lucide-react';

export default function AdminAttendance() {
  const { lang, t } = useLanguage();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('all');

  // Manual Override Modal
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [overrideData, setOverrideData] = useState({
    status: 'working',
    checkIn: '08:00 AM',
    checkOut: '05:00 PM',
    reason: '',
  });
  const [overrideError, setOverrideError] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedDate) params.date = selectedDate;
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await api.getLogs(params);
      if (res.success) {
        setLogs(res.logs);
      }
    } catch (err) {
      console.error('Fetch attendance logs error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedDate, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  const openOverrideModal = (log) => {
    setSelectedLog(log);
    setOverrideData({
      status: log.status || 'working',
      checkIn: log.checkIn || '08:00 AM',
      checkOut: log.checkOut || '05:00 PM',
      reason: log.overrideReason || '',
    });
    setOverrideError('');
    setIsOverrideOpen(true);
  };

  const handleOverrideSubmit = async (e) => {
    e.preventDefault();
    if (!overrideData.reason.trim()) {
      setOverrideError(
        lang === 'km'
          ? 'សូមបញ្ជាក់មូលហេតុនៃការកែប្រែវត្តមាន'
          : 'Please provide a reason for the manual override'
      );
      return;
    }

    try {
      await api.manualOverride({
        recordId: selectedLog?.id,
        userId: selectedLog?.userId,
        date: selectedLog?.date || selectedDate,
        status: overrideData.status,
        checkIn: overrideData.checkIn,
        checkOut: overrideData.checkOut,
        reason: overrideData.reason,
      });

      setIsOverrideOpen(false);
      fetchLogs();
      alert(lang === 'km' ? 'បានកែប្រែវត្តមានជោគជ័យ' : 'Attendance overridden successfully');
    } catch (err) {
      setOverrideError(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            {lang === 'km' ? 'កំណត់ត្រាវត្តមានជាក់ស្តែង' : 'Attendance Logs'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'km'
              ? 'តារាង Scan ជាក់ស្តែង និងសិទ្ធិកែប្រែស្ថានភាព (Manual Override) ជាមួយ Reason Log'
              : 'Audit trail of check-ins, check-outs, and administrative overrides'}
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3.5 sm:p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        </form>

        {/* Date and Status Filters */}
        <div className="w-full md:w-auto grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200">
            <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white outline-none cursor-pointer w-full"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500"
          >
            <option value="all">{lang === 'km' ? 'គ្រប់ស្ថានភាព' : 'All Statuses'}</option>
            <option value="working">🟢 Working (ចូល)</option>
            <option value="checked_out">🔵 Checked-Out (ចេញ)</option>
            <option value="off_duty">⚪ Off Duty (មិនទាន់ចូល)</option>
            <option value="permission">🟡 Permission (ច្បាប់)</option>
          </select>
        </div>
      </div>

      {/* Mobile Attendance Cards View (sm:hidden) */}
      <div className="sm:hidden space-y-3">
        {logs.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            {lang === 'km' ? 'មិនមានទិន្នន័យសម្រាប់ថ្ងៃនេះទេ' : 'No attendance logs found'}
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-white text-sm">{log.userName}</h4>
                  <p className="text-xs text-slate-400 font-mono">{log.userId} • {log.department}</p>
                </div>
                <StatusBadge status={log.status} />
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Check In</span>
                  <span className="font-mono font-bold text-emerald-400">{log.checkIn || '-'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Check Out</span>
                  <span className="font-mono font-bold text-blue-400">{log.checkOut || '-'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Hours</span>
                  <span className="font-medium text-slate-200">{log.totalHours || '-'}</span>
                </div>
              </div>

              {log.overrideReason && (
                <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2 rounded-xl">
                  ⚠️ Override: {log.overrideReason} (by {log.overriddenBy})
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>{log.date}</span>
                <button
                  onClick={() => openOverrideModal(log)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 active:scale-95 border border-slate-700"
                >
                  <FileEdit className="w-3.5 h-3.5 text-amber-400" />
                  <span>កែប្រែ (Override)</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Attendance Logs Table (hidden sm:block) */}
      <div className="hidden sm:block bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">អត្តលេខ (ID)</th>
                <th className="py-3 px-4">ឈ្មោះ (Name)</th>
                <th className="py-3 px-4">កាលបរិច្ឆេទ</th>
                <th className="py-3 px-4">ម៉ោងចូល</th>
                <th className="py-3 px-4">ម៉ោងចេញ</th>
                <th className="py-3 px-4">ម៉ោងសរុប</th>
                <th className="py-3 px-4">ស្ថានភាព</th>
                <th className="py-3 px-4">វិធីសាស្ត្រ & Geofence</th>
                <th className="py-3 px-4 text-right">កែប្រែ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-10 text-center text-slate-400">
                    {lang === 'km' ? 'មិនមានទិន្នន័យសម្រាប់ថ្ងៃនេះទេ' : 'No records found matching query'}
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-white">{log.userId}</td>
                    <td className="py-3 px-4 font-semibold text-slate-100">
                      {log.userName}
                      <span className="text-[10px] text-slate-500 block">{log.department}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{log.date}</td>
                    <td className="py-3 px-4 font-mono font-medium text-emerald-400">
                      {log.checkIn || '-'}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-blue-400">
                      {log.checkOut || '-'}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-medium">{log.totalHours || '-'}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="py-3 px-4 text-[11px]">
                      {log.overrideReason ? (
                        <div className="text-amber-400">
                          <span className="font-semibold">⚠️ Manual Override</span>
                          <span className="text-slate-400 block truncate max-w-xs" title={log.overrideReason}>
                            {log.overrideReason} (by {log.overriddenBy})
                          </span>
                        </div>
                      ) : (
                        <div className="text-slate-400">
                          <span>{log.method || 'QR_SCAN'}</span>
                          {log.distanceMeters !== undefined && (
                            <span className="text-emerald-400 block text-[10px] font-mono">
                              {log.distanceMeters}m from campus
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openOverrideModal(log)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold transition-all inline-flex items-center gap-1 active:scale-95"
                      >
                        <FileEdit className="w-3.5 h-3.5 text-amber-400" />
                        <span>Override</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Override Modal */}
      {isOverrideOpen && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base">
                  {lang === 'km' ? 'កែប្រែស្ថានភាពវត្តមាន (Manual Override)' : 'Manual Attendance Override'}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedLog.userName} ({selectedLog.userId})
                </p>
              </div>
              <button onClick={() => setIsOverrideOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {overrideError && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
                {overrideError}
              </div>
            )}

            <form onSubmit={handleOverrideSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ស្ថានភាពវត្តមាន (Status)
                </label>
                <select
                  value={overrideData.status}
                  onChange={(e) => setOverrideData({ ...overrideData, status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                >
                  <option value="working">🟢 Working (ចូលការងារ / Present)</option>
                  <option value="checked_out">🔵 Checked-Out (ចេញការងាររួច)</option>
                  <option value="off_duty">⚪ Off Duty (អវត្តមាន / មិនទាន់ចូល)</option>
                  <option value="permission">🟡 Permission (សុំច្បាប់ / ឈប់មានការអនុញ្ញាត)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ម៉ោងចូល (Check In Time)
                  </label>
                  <input
                    type="text"
                    value={overrideData.checkIn}
                    onChange={(e) => setOverrideData({ ...overrideData, checkIn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ម៉ោងចេញ (Check Out Time)
                  </label>
                  <input
                    type="text"
                    value={overrideData.checkOut}
                    onChange={(e) => setOverrideData({ ...overrideData, checkOut: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  មូលហេតុនៃការកែប្រែ (Reason Log - Required) *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder={
                    lang === 'km'
                      ? 'ឧ. ភ្លេចទូរស័ព្ទ, ទូរស័ព្ទអស់ថ្ម, ឬមានបេសកកម្មក្រៅ...'
                      : 'e.g. Forgot phone, battery depleted, official mission...'
                  }
                  value={overrideData.reason}
                  onChange={(e) => setOverrideData({ ...overrideData, reason: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOverrideOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold rounded-xl"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
