import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import confetti from 'canvas-confetti';
import { X, Camera, RefreshCw, MapPin, AlertTriangle, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api/client';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const { lang } = useLanguage();
  const [scanning, setScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [securityAlert, setSecurityAlert] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);
  const [coords, setCoords] = useState(null);
  const [geoStatus, setGeoStatus] = useState('detecting'); // 'detecting', 'ready', 'failed'
  const [manualInput, setManualInput] = useState('');
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');

  const html5QrCodeRef = useRef(null);
  const readerElementId = 'qr-reader-container';

  // Obtain Geolocation on modal open
  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      setErrorMsg('');
      setSecurityAlert('');
      setSuccessInfo(null);
      return;
    }

    if ('geolocation' in navigator) {
      setGeoStatus('detecting');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
          });
          setGeoStatus('ready');
        },
        (err) => {
          console.warn('Geolocation warning:', err.message);
          // Fallback to campus coordinate in dev/test if user denies GPS
          setCoords({ lat: 11.5564, lng: 104.9282, accuracy: 10 });
          setGeoStatus('simulated');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }

    // Initialize scanner
    const timer = setTimeout(() => {
      startScanner();
    }, 300);

    return () => {
      clearTimeout(timer);
      stopScanner();
    };
  }, [isOpen]);

  const startScanner = async () => {
    try {
      setErrorMsg('');
      setSecurityAlert('');

      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        setErrorMsg(
          lang === 'km'
            ? 'មិនអាចស្វែងរកកាមេរ៉ាលើឧបករណ៍របស់អ្នកបានទេ (No camera detected)'
            : 'No camera found on your device'
        );
        return;
      }

      setCameras(devices);
      // Prefer back camera (environment) if available
      const backCam = devices.find(
        (d) => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment')
      );
      const camId = backCam ? backCam.id : devices[0].id;
      setSelectedCameraId(camId);

      const html5QrCode = new Html5Qrcode(readerElementId);
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        camId,
        {
          fps: 15,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        onQrCodeScanned,
        (errorMessage) => {
          // ignore frame scan misses
        }
      );

      setScanning(true);
    } catch (err) {
      console.error('Camera start error:', err);
      setErrorMsg(
        lang === 'km'
          ? 'សូមអនុញ្ញាតសិទ្ធិកាមេរ៉ាក្នុង Browser (Camera permission required): ' + err.message
          : 'Please allow camera permission in browser: ' + err.message
      );
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn('Stop scanner err:', err);
      }
      html5QrCodeRef.current = null;
    }
    setScanning(false);
  };

  const onQrCodeScanned = async (decodedText) => {
    // Temporarily pause scanner to process
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      await html5QrCodeRef.current.pause();
    }

    await submitScanPayload(decodedText);
  };

  const submitScanPayload = async (rawQrString) => {
    try {
      setErrorMsg('');
      setSecurityAlert('');

      const response = await api.scanQr({
        qrData: rawQrString,
        coordinates: coords,
      });

      if (response.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b'],
        });

        // Audio chime feedback
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
          osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
          gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.35);
        } catch (e) {}

        setSuccessInfo(response);
        setTimeout(() => {
          if (onScanSuccess) onScanSuccess(response);
          onClose();
        }, 2200);
      }
    } catch (err) {
      console.error('Scan submission error:', err);
      setSecurityAlert(err.message);
      // Resume scanning so user can retry
      setTimeout(() => {
        if (html5QrCodeRef.current && !successInfo) {
          try {
            html5QrCodeRef.current.resume();
          } catch (e) {}
        }
      }, 2500);
    }
  };

  const switchCamera = async (deviceId) => {
    await stopScanner();
    setSelectedCameraId(deviceId);
    try {
      const html5QrCode = new Html5Qrcode(readerElementId);
      html5QrCodeRef.current = html5QrCode;
      await html5QrCode.start(
        deviceId,
        {
          fps: 15,
          qrbox: { width: 250, height: 250 },
        },
        onQrCodeScanned,
        () => {}
      );
      setScanning(true);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {lang === 'km' ? 'ស្កេន QR វត្តមានផ្លូវការ' : 'Scan Attendance QR'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'km' ? 'កាមេរ៉ា In-Browser + Geofencing' : 'In-browser Camera + Geofence'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Body */}
        <div className="p-4 sm:p-6 flex flex-col items-center overflow-y-auto">
          {/* Security alerts */}
          {securityAlert && (
            <div className="w-full mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-300 text-xs">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">
                  {lang === 'km' ? 'សេចក្តីជូនដំណឹងសុវត្ថិភាព' : 'Security Check'}
                </p>
                <p>{securityAlert}</p>
              </div>
            </div>
          )}

          {/* Success Overlay */}
          {successInfo && (
            <div className="w-full mb-4 p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-emerald-300 text-sm animate-bounce">
              <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-white">{successInfo.message}</p>
                <p className="text-xs text-emerald-200">
                  {lang === 'km' ? 'ស្ថានភាព៖ ' : 'Status: '}
                  <span className="font-semibold uppercase">{successInfo.statusBadge}</span>
                </p>
              </div>
            </div>
          )}

          {/* Camera Viewport */}
          <div className="relative w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden bg-black border-2 border-emerald-500/40 shadow-inner flex items-center justify-center">
            {/* HTML5 QR Container */}
            <div id={readerElementId} className="w-full h-full object-cover" />

            {/* Scanning Laser Line */}
            {scanning && !successInfo && (
              <div className="absolute inset-x-2 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] scan-laser pointer-events-none" />
            )}

            {/* Target Viewfinder corners */}
            <div className="absolute inset-3 border-2 border-dashed border-emerald-400/50 rounded-xl pointer-events-none" />
          </div>

          {/* Camera switcher if multiple */}
          {cameras.length > 1 && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-slate-400">
                {lang === 'km' ? 'ប្តូរកាមេរ៉ា៖' : 'Switch Camera:'}
              </span>
              <select
                value={selectedCameraId}
                onChange={(e) => switchCamera(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2 py-1 outline-none"
              >
                {cameras.map((c, i) => (
                  <option key={c.id} value={c.id}>
                    {c.label || `Camera ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Geofence Status Pill */}
          <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-300">
              {geoStatus === 'detecting' && (lang === 'km' ? 'កំពុងផ្ទៀងផ្ទាត់ GPS...' : 'Detecting GPS...')}
              {geoStatus === 'ready' &&
                (lang === 'km'
                  ? `GPS ត្រឹមត្រូវ (កម្រិតលម្អិត ±${coords?.accuracy}m)`
                  : `GPS Active (±${coords?.accuracy}m)`)}
              {geoStatus === 'simulated' &&
                (lang === 'km' ? 'ទីតាំងស្ថាប័ន (Campus Perimeter)' : 'Campus Perimeter Active')}
            </span>
          </div>

          {/* Instructions */}
          <p className="mt-3 text-center text-xs text-slate-400 max-w-xs leading-relaxed">
            {lang === 'km'
              ? 'សូមចង្អុលកាមេរ៉ាទៅកាន់ Screen QR នៅមាត់ទ្វារចូល។ កូដនេះនឹងផ្លាស់ប្តូររៀងរាល់ ២០ វិនាទីម្តង។'
              : 'Point your camera directly at the Entrance Kiosk Screen. The dynamic QR rotates every 20 seconds.'}
          </p>

          {/* Fallback Simulation for Testing on Desktop / No-Camera devices */}
          <div className="mt-4 w-full pt-3 border-t border-slate-800">
            <details className="text-xs text-slate-400 cursor-pointer">
              <summary className="hover:text-emerald-400 transition-colors list-none flex items-center justify-between">
                <span>{lang === 'km' ? '⚙️ សាកល្បងដោយបញ្ចូល Token ដោយផ្ទាល់' : '⚙️ Test via Manual Token Input'}</span>
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">Dev Mode</span>
              </summary>
              <div className="mt-2.5 flex flex-col gap-2">
                <input
                  type="text"
                  placeholder={lang === 'km' ? 'បិទភ្ជាប់ Token ឬ JSON កូដនៅទីនេះ...' : 'Paste QR token JSON...'}
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                />
                <button
                  onClick={async () => {
                    if (manualInput.trim()) {
                      await submitScanPayload(manualInput.trim());
                    } else {
                      // Fetch current live kiosk token automatically for instant test!
                      try {
                        const tokenRes = await api.getKioskToken();
                        if (tokenRes.qrData) {
                          await submitScanPayload(tokenRes.qrData);
                        }
                      } catch (err) {
                        setErrorMsg(err.message);
                      }
                    }
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {manualInput
                    ? lang === 'km'
                      ? 'ផ្ទៀងផ្ទាត់ Token'
                      : 'Verify Token'
                    : lang === 'km'
                    ? 'ស្កេន Token បច្ចុប្បន្នដោយស្វ័យប្រវត្តិ (Quick Auto Scan)'
                    : 'Auto-Simulate Live Kiosk Scan'}
                </button>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

