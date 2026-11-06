import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Check, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function NotificationBanner() {
  const { lang } = useLanguage();
  const [permission, setPermission] = useState('default');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestNotification = async () => {
    if (!('Notification' in window)) {
      alert('Browser របស់អ្នកមិនគាំទ្រ Web Push Notifications ទេ');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        new Notification('🔔 ប្រព័ន្ធវត្តមាន (Attendance System)', {
          body: 'ការដាស់តឿនត្រូវបានបើកជោគជ័យ! អ្នកនឹងទទួលបាន Notification នៅពេលដល់ម៉ោង Scan Check-out។',
          icon: '/favicon.ico',
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const triggerTestNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('⏰ ដាស់តឿនចេញការងារ / រៀន (End-of-Shift Reminder)', {
        body: 'ដល់ម៉ោងបញ្ចប់វេនការងារហើយ! សូមកុំភ្លេចចូលមកកាន់ប្រព័ន្ធដើម្បី Scan QR Check-out។',
        icon: '/favicon.ico',
      });
    } else {
      requestNotification();
    }
  };

  if (dismissed || permission === 'denied') return null;

  return (
    <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/50 border border-indigo-500/30 rounded-2xl p-4 mb-6 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            {permission === 'granted' ? <BellRing className="w-5 h-5 text-emerald-400" /> : <Bell className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              {lang === 'km' ? 'ប្រព័ន្ធដាស់តឿន Web Push Notifications' : 'Automated Web Push Reminder'}
              {permission === 'granted' && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                  {lang === 'km' ? 'បានបើក' : 'Active'}
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-300">
              {lang === 'km'
                ? 'ទទួលការរំលឹកនៅលើទូរស័ព្ទ / កុំព្យូទ័រ នៅពេលដល់ម៉ោង Scan ចេញការងារ (Check-out) ដើម្បីកុំឱ្យភ្លេច'
                : 'Get automated alerts on your device at end-of-shift so you never forget to scan check-out'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {permission !== 'granted' ? (
            <button
              onClick={requestNotification}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              {lang === 'km' ? 'បើកការដាស់តឿន' : 'Enable Alerts'}
            </button>
          ) : (
            <button
              onClick={triggerTestNotification}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-all flex items-center gap-1"
            >
              <BellRing className="w-3.5 h-3.5 text-indigo-400" />
              {lang === 'km' ? 'សាកល្បង Notification' : 'Test Alert'}
            </button>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

