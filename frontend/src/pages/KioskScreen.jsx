import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api/client';
import {
  ShieldCheck,
  RefreshCw,
  Clock,
  Maximize2,
  Minimize2,
  Sparkles,
  MapPin,
  Volume2,
  VolumeX,
} from 'lucide-react';

export default function KioskScreen() {
  const { lang } = useLanguage();
  const [qrPayload, setQrPayload] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(20);
  const [rotationInterval, setRotationInterval] = useState(20);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [clock, setClock] = useState(new Date());
  const [rotationCount, setRotationCount] = useState(0);

  const containerRef = useRef(null);

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch rotating dynamic token
  const fetchNewToken = async () => {
    try {
      const res = await api.getKioskToken();
      if (res.qrData) {
        setQrPayload(res.qrData);
        const ttl = res.ttlSeconds || 20;
        setRotationInterval(ttl);
        setSecondsLeft(ttl);
        setRotationCount((c) => c + 1);

        if (soundEnabled && rotationCount > 0) {
          playTickSound();
        }
      }
    } catch (err) {
      console.error('Fetch kiosk token error:', err);
    }
  };

  const playTickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}
  };

  // Initial fetch
  useEffect(() => {
    fetchNewToken();
  }, []);

  // Countdown timer & rotation trigger
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          fetchNewToken();
          return rotationInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [rotationInterval, soundEnabled, rotationCount]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const progressPercent = ((rotationInterval - secondsLeft) / rotationInterval) * 100;

  return (
    <div
      ref={containerRef}
      className="min-h-[85vh] bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar on Kiosk Screen */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-6 z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">
              GATE ATTENDANCE KIOSK
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'km' ? 'អេក្រង់ QR Code ផ្លូវការនៅមាត់ទ្វារស្ថាប័ន' : 'Live Campus Entrance Scanner Screen'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Centerpiece: Dynamic Screen QR Box */}
      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col items-center relative z-10">
        {/* Security Alert Header */}
        <div className="w-full mb-4 px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{lang === 'km' ? 'កូដការពារការលួចថតផ្ញើពីផ្ទះ' : 'Anti-Fraud Dynamic Rolling QR'}</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
            HMAC-SHA256
          </span>
        </div>

        {/* QR Code Container with High Contrast & Soft Corner Framing */}
        <div className="relative p-6 bg-white rounded-3xl shadow-2xl flex items-center justify-center border-4 border-emerald-500/40 glow-emerald">
          {qrPayload ? (
            <QRCodeSVG
              value={qrPayload}
              size={260}
              level="H"
              includeMargin={false}
              className="rounded-xl transition-all duration-300"
            />
          ) : (
            <div className="w-[260px] h-[260px] flex items-center justify-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          )}

          {/* Center Logo Shield */}
          <div className="absolute inset-auto w-12 h-12 bg-slate-950 rounded-xl border-2 border-emerald-400 flex items-center justify-center shadow-lg pointer-events-none">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* Dynamic Rotation Progress & Countdown */}
        <div className="w-full mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400 flex items-center gap-1.5">
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${secondsLeft <= 3 ? 'animate-spin' : ''}`} />
              {lang === 'km' ? 'ប្តូរកូដថ្មីក្នុងរយៈពេល៖' : 'Next Dynamic Rotation in:'}
            </span>
            <span className="text-emerald-400 font-mono font-bold text-sm">
              {secondsLeft}s
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-linear shadow-[0_0_10px_#10b981]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Clock & Geofence Banner */}
        <div className="w-full mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="font-mono font-bold text-white text-sm">
              {clock.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'km' ? 'បរិវេណស្ថាប័នផ្លូវការ' : 'Campus Gate Perimeter'}</span>
          </div>
        </div>
      </div>

      {/* Bottom Instructions */}
      <div className="mt-6 text-center text-xs text-slate-400 max-w-md z-10 leading-relaxed">
        {lang === 'km'
          ? 'សូមបើក App វត្តមានលើទូរស័ព្ទរបស់អ្នក រួចចុច "Scan QR" ដើម្បី Check-in ឬ Check-out។ កូដនេះមានសុពលភាពត្រឹម ២០ វិនាទីប៉ុណ្ណោះ។'
          : 'Open the Attendance Web App on your smartphone and tap "Scan QR" to check in or out. This token dynamically expires every 20 seconds.'}
      </div>
    </div>
  );
}

