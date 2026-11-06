require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbService } = require('./config/firebase');

const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const qrRoutes = require('./routes/qr');
const userRoutes = require('./routes/users');
const reportsRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportsRoutes);

// Health check and system info endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Universal Web-Based Attendance Tracking System API',
    version: '1.0.0',
    firebaseConnected: dbService.isLiveFirebase(),
    storageMode: dbService.isLiveFirebase() ? 'Live Firebase Firestore & RTDB' : 'Local High-Fidelity Store',
    geofenceConfig: {
      enabled: process.env.GEOFENCE_ENABLED !== 'false',
      radiusMeters: parseInt(process.env.GEOFENCE_RADIUS_METERS || '200', 10),
    },
    qrRotationSeconds: parseInt(process.env.QR_ROTATION_INTERVAL_SECONDS || '20', 10),
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('================================================================');
  console.log(`🚀 Attendance Backend Server running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📡 Storage Backend: ${dbService.isLiveFirebase() ? 'Live Google Firebase' : 'Local Persistent Storage (Ready for Firebase)'}`);
  console.log(`📍 Geofencing: ${process.env.GEOFENCE_ENABLED !== 'false' ? 'ENABLED' : 'DISABLED (Dev Mode)'}`);
  console.log(`🔄 Dynamic QR Token Rotation: every ${process.env.QR_ROTATION_INTERVAL_SECONDS || 20}s`);
  console.log('================================================================');
});

