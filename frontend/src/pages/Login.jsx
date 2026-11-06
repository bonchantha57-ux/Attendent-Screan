import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { QrCode, Lock, Mail, ArrowRight, AlertCircle, Database } from 'lucide-react';

export default function Login({ onSwitchToRegister, onLoginSuccess }) {
  const { login } = useAuth();
  const { lang, toggleLang } = useLanguage();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim() || !password) {
      setError(
        lang === 'km'
          ? 'សូមបញ្ចូលអត្តលេខ ឬ Email និងពាក្យសម្ងាត់'
          : 'Please enter User ID or Email and Password'
      );
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(userId.trim(), password);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-8 sm:p-6 relative overflow-hidden">
      {/* Dynamic ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Language toggle top right */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20">
        <button
          onClick={toggleLang}
          className="px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-md active:scale-95 flex items-center gap-1.5 backdrop-blur-md"
        >
          <span>{lang === 'km' ? '🇰🇭 ភាសាខ្មែរ' : '🇬🇧 English'}</span>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 p-0.5 shadow-2xl shadow-emerald-500/25 mb-3.5 group">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <QrCode className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
            ATTENDANCE<span className="text-emerald-400">.LIVE</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-2 font-normal">
            {lang === 'km'
              ? 'ប្រព័ន្ធកត់ត្រាវត្តមានឆ្លាតវៃតាមកាមេរ៉ាស្កេន QR ផ្លូវការ'
              : 'Universal Web-Based Attendance Tracking Portal'}
          </p>
        </div>

        {/* Clean Login Box */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {lang === 'km' ? 'ចូលប្រើប្រាស់ប្រព័ន្ធ' : 'Sign In to Your Account'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'km'
                ? 'បញ្ចូលអត្តលេខ ឬ Email និងពាក្យសម្ងាត់របស់អ្នក'
                : 'Enter your User ID or Email and password to continue'}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-2.5 text-rose-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {lang === 'km' ? 'អត្តលេខ ឬ Email' : 'User ID or Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4 text-emerald-400/80" />
                </div>
                <input
                  type="text"
                  placeholder={lang === 'km' ? 'បញ្ចូលអត្តលេខ ឬ Email...' : 'Enter User ID or Email...'}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {lang === 'km' ? 'ពាក្យសម្ងាត់ (Password)' : 'Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4 text-emerald-400/80" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.98] text-slate-950 font-bold rounded-2xl shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-3 tracking-wide"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{lang === 'km' ? 'ចូលប្រព័ន្ធ (Sign In)' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              {lang === 'km' ? 'មិនទាន់មានគណនីមែនទេ?' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline transition-all ml-1"
              >
                {lang === 'km' ? 'ចុះឈ្មោះទីនេះ (Register)' : 'Sign up here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
