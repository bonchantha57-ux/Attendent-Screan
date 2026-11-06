const express = require('express');
const router = express.Router();
const { generateDynamicQrPayload, ROTATION_SECONDS } = require('../utils/qrSecurity');
const { dbService } = require('../config/firebase');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

// GET /api/qr/kiosk-token - For Gate Monitor / Kiosk Screen
router.get('/kiosk-token', async (req, res) => {
  try {
    const payload = generateDynamicQrPayload();
    await dbService.updateKioskQr(payload);

    res.json({
      success: true,
      qrData: payload.qrData,
      expiresAt: payload.expiresAt,
      ttlSeconds: payload.ttlSeconds,
      serverTime: Date.now(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/qr/geofence-config
router.get('/geofence-config', async (req, res) => {
  try {
    const config = await dbService.getGeofenceConfig();
    res.json({
      success: true,
      enabled: config.enabled,
      geofenceType: config.geofenceType || (config.polygonCoords?.length >= 3 ? 'polygon' : 'circle'),
      campusCoordinates: { lat: config.lat, lng: config.lng },
      radiusMeters: config.radiusMeters,
      polygonCoords: config.polygonCoords || [],
      locationName: config.locationName,
      updatedAt: config.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/qr/geofence-config - Save updated Geofence from Admin Interactive Map
router.post('/geofence-config', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { lat, lng, radiusMeters, enabled, locationName, geofenceType, polygonCoords } = req.body;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: 'កូអរដោនេ Latitude និង Longitude ត្រូវបានទាមទារ (Latitude & Longitude required)',
      });
    }

    const updated = await dbService.updateGeofenceConfig({
      lat,
      lng,
      radiusMeters: radiusMeters || 200,
      enabled: enabled !== false,
      geofenceType: geofenceType || (polygonCoords?.length >= 3 ? 'polygon' : 'circle'),
      polygonCoords: Array.isArray(polygonCoords) ? polygonCoords : [],
      locationName: locationName || 'Campus Main Entrance / Gate Screen',
    });

    res.json({
      success: true,
      message: 'បានរក្សាទុកទីតាំង និងបរិវេណស្កេនជោគជ័យ (Geofence perimeter updated)',
      config: {
        enabled: updated.enabled,
        geofenceType: updated.geofenceType,
        campusCoordinates: { lat: updated.lat, lng: updated.lng },
        radiusMeters: updated.radiusMeters,
        polygonCoords: updated.polygonCoords,
        locationName: updated.locationName,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

