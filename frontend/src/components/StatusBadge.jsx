import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Ban, CheckCircle2, LogOut, Clock } from 'lucide-react';

export default function StatusBadge({ status, size = 'default' }) {
  const { lang } = useLanguage();

  const configs = {
    off_duty: {
      khmerText: 'មិនទាន់ចូល',
      enText: 'Off Duty',
      bgClass: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      dotClass: 'bg-rose-500',
      glowClass: 'shadow-rose-500/20',
      icon: Ban,
    },
    working: {
      khmerText: 'ចូលការងារ / កំពុងរៀន',
      enText: 'Working / Active',
      bgClass: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400',
      dotClass: 'bg-emerald-500 animate-ping',
      glowClass: 'shadow-emerald-500/30 glow-emerald',
      icon: CheckCircle2,
    },
    checked_out: {
      khmerText: 'ចេញការងាររួចរាល់',
      enText: 'Checked-Out',
      bgClass: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      dotClass: 'bg-blue-500',
      glowClass: 'shadow-blue-500/20 glow-blue',
      icon: LogOut,
    },
  };

  const current = configs[status] || configs.off_duty;
  const IconComponent = current.icon;

  if (size === 'large') {
    return (
      <div
        className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl border ${current.bgClass} shadow-lg ${current.glowClass} backdrop-blur-sm transition-all duration-300`}
      >
        <div className="relative flex items-center justify-center">
          <span className={`absolute inline-flex h-3 w-3 rounded-full ${current.dotClass} opacity-75`} />
          <IconComponent className="w-6 h-6 relative z-10" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs uppercase tracking-wider font-semibold opacity-70">
            {lang === 'km' ? current.enText : current.khmerText}
          </span>
          <span className="text-base font-bold tracking-tight">
            {lang === 'km' ? current.khmerText : current.enText}
          </span>
        </div>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${current.bgClass} shadow-sm`}
    >
      <span className={`w-2 h-2 rounded-full ${current.dotClass}`} />
      <IconComponent className="w-3.5 h-3.5" />
      <span>{lang === 'km' ? current.khmerText : current.enText}</span>
    </span>
  );
}

