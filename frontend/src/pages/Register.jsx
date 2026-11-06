import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { QrCode, Lock, User, Building, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Register({ onSwitchToLogin, onRegisterSuccess }) {
  const { register } = useAuth();
  const { lang, toggleLang } = useLanguage();
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Computer Science & IT');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const departmentsList = [
    'Computer Science & IT',
    'Software Engineering - Year 3',
    'Information Technology - Year 2',
    'Graphic Design & Multimedia',
    'Business & Administration',
    'Faculty & Staff Team',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !userId.trim() || !password || !department) {
      setError(lang === 'km' ? 'សូមបំពេញព័ត៌មានឱ្យបានគ្រប់ជ្រុងជ្រោយ' : 'Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register({
        name: name.trim(),
        userId: userId.trim().toUpperCase(),
        password,
        department,
        role,
      });
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Language toggle top right */}
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleLang}
          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
        >
          {lang === 'km' ? '🇰🇭 ភាសាខ្មែរ' : '🇬🇧 English'}
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 mb-3">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <QrCode className="w-7 h-7 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {lang === 'km' ? 'ចុះឈ្មោះគណនីថ្មី' : 'Create New Account'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'km' ? 'បំពេញព័ត៌មានដើម្បីចាប់ផ្តើមប្រើប្រាស់វត្តមាន' : 'Join the Universal Attendance Portal'}
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-300 text-xs animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'km' ? 'ឈ្មោះពេញ (Full Name)' : 'Full Name'}
              </label>
              <input
                type="text"
                placeholder="e.g. Chantha Born"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'km' ? 'អត្តលេខ (User ID)' : 'User ID'}
                </label>
                <input
                  type="text"
                  placeholder="STU-889"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500 outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'km' ? 'តួនាទី (Role)' : 'Role'}
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
                >
                  <option value="student">🎓 Student (សិស្ស/និស្សិត)</option>
                  <option value="staff">👨‍🏫 Staff (គ្រូបង្រៀន/បុគ្គលិក)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'km' ? 'ថ្នាក់ ឬដេប៉ាតឺម៉ង់ (Class / Department)' : 'Class / Department'}
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              >
                {departmentsList.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'km' ? 'ពាក្យសម្ងាត់ (Password)' : 'Password'}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{lang === 'km' ? 'បង្កើតគណនី (Sign Up)' : 'Sign Up'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              {lang === 'km' ? 'មានគណនីរួចហើយ?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline transition-all"
              >
                {lang === 'km' ? 'ចូលប្រព័ន្ធទីនេះ (Sign In)' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

