const express = require('express');
const router = express.Router();
const { dbService } = require('../config/firebase');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');
const { verifyDynamicQrPayload } = require('../utils/qrSecurity');
const { verifyGeofence, verifyUnifiedGeofence } = require('../utils/geoUtils');

function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function calculateWorkHours(checkInIso, checkOutIso) {
  const start = new Date(checkInIso).getTime();
  const end = new Date(checkOutIso).getTime();
  const diffMs = Math.max(0, end - start);
  const diffHours = diffMs / (1000 * 60 * 60);
  const hours = Math.floor(diffHours);
  const minutes = Math.round((diffHours - hours) * 60);
  return `${hours} ម៉ោង ${minutes} នាទី (${diffHours.toFixed(1)}h)`;
}

// GET /api/attendance/today-status - Check current user status
router.get('/today-status', authenticateToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const record = await dbService.getTodayAttendanceForUser(req.user.userId, today);

    let status = 'off_duty'; // 'off_duty' | 'working' | 'checked_out'
    if (record) {
      status = record.status;
    }

    res.json({
      success: true,
      today,
      record: record || null,
      statusBadge: status, // off_duty, working, checked_out
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/attendance/scan - Camera Scan (Check-in or Check-out)
router.post('/scan', authenticateToken, async (req, res) => {
  try {
    const { qrData, coordinates, scanAction } = req.body;
    // scanAction can be 'auto', 'check_in', 'check_out'

    if (!qrData) {
      return res.status(400).json({
        success: false,
        message: 'មិនមានទិន្នន័យ QR Code ត្រូវបានបញ្ជូនមកទេ (QR Code data required)',
      });
    }

    // 1. Verify Dynamic Rotating QR Code Security
    const qrCheck = verifyDynamicQrPayload(qrData);
    if (!qrCheck.valid) {
      return res.status(400).json({
        success: false,
        securityAlert: true,
        message: qrCheck.error,
      });
    }

    // 2. Geofence Verification (dynamically configured by Admin on interactive map)
    const geoConfig = await dbService.getGeofenceConfig();
    const geofenceEnabled = geoConfig.enabled;
    const campusLat = geoConfig.lat;
    const campusLng = geoConfig.lng;
    const campusRadius = geoConfig.radiusMeters;

    let distanceMeters = 0;
    if (geofenceEnabled) {
      if (!coordinates || typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number') {
        return res.status(400).json({
          success: false,
          securityAlert: true,
          message: 'សូមបើក GPS Location នៅលើទូរស័ព្ទ ឬ Browser ដើម្បីផ្ទៀងផ្ទាត់វត្តមានក្នុងបរិវេណ (GPS coordinates required)',
        });
      }

      const geoResult = verifyUnifiedGeofence({
        userLat: coordinates.lat,
        userLng: coordinates.lng,
        geoConfig,
      });
      distanceMeters = geoResult.distance;

      if (!geoResult.allowed) {
        return res.status(403).json({
          success: false,
          securityAlert: true,
          message:
            geoResult.message ||
            `អ្នកស្ថិតនៅក្រៅបរិវេណស្ថាប័ន (ចម្ងាយ ${geoResult.distance}m)! មិនអាច Scan បានទេ (Outside Campus Perimeter)`,
          distance: geoResult.distance,
        });
      }
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const timeFormatted = formatTime(now);

    let todayRecord = await dbService.getTodayAttendanceForUser(req.user.userId, today);

    // Determine whether this scan is Check-in or Check-out
    if (!todayRecord || todayRecord.status === 'off_duty') {
      // PERFORM CHECK-IN
      // Check if late (e.g. after 08:30 AM)
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const isLate = currentHour > 8 || (currentHour === 8 && currentMinute > 30);

      const newRecord = {
        userId: req.user.userId,
        userName: req.user.name,
        role: req.user.role,
        department: req.user.department,
        date: today,
        checkIn: timeFormatted,
        checkInTime: now.toISOString(),
        checkOut: null,
        checkOutTime: null,
        totalHours: null,
        status: 'working',
        attendanceType: isLate ? 'late' : 'present',
        method: 'QR_SCAN',
        device: req.headers['user-agent'] || 'Web Browser',
        distanceMeters,
        overrideReason: null,
        overriddenBy: null,
        createdAt: now.toISOString(),
      };

      const saved = await dbService.saveAttendanceRecord(newRecord);
      return res.json({
        success: true,
        action: 'check_in',
        statusBadge: 'working',
        message: `Scan Check-in ជោគជ័យ! ស្វាគមន៍មកកាន់ការងារ/ថ្នាក់រៀន ម៉ោង ${timeFormatted}`,
        record: saved,
      });
    } else if (todayRecord.status === 'working') {
      // PERFORM CHECK-OUT
      const checkInIso = todayRecord.checkInTime || todayRecord.createdAt;
      const totalHours = calculateWorkHours(checkInIso, now.toISOString());

      todayRecord.checkOut = timeFormatted;
      todayRecord.checkOutTime = now.toISOString();
      todayRecord.totalHours = totalHours;
      todayRecord.status = 'checked_out';
      todayRecord.updatedAt = now.toISOString();

      const saved = await dbService.saveAttendanceRecord(todayRecord);
      return res.json({
        success: true,
        action: 'check_out',
        statusBadge: 'checked_out',
        message: `Scan Check-out ជោគជ័យ! ចេញការងារម៉ោង ${timeFormatted} (សរុប: ${totalHours})`,
        record: saved,
      });
    } else {
      // Already checked-out today
      return res.json({
        success: true,
        action: 'already_checked_out',
        statusBadge: 'checked_out',
        message: `អ្នកបាន Scan Check-out រួចរាល់ហើយសម្រាប់ថ្ងៃនេះ (${todayRecord.checkIn} - ${todayRecord.checkOut})`,
        record: todayRecord,
      });
    }
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// GET /api/attendance/my-history
router.get('/my-history', authenticateToken, async (req, res) => {
  try {
    const list = await dbService.getAllAttendance({ userId: req.user.userId });
    res.json({ success: true, attendance: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/attendance/logs - Admin table with filters
router.get('/logs', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { date, startDate, endDate, role, department, status, search } = req.query;
    let list = await dbService.getAllAttendance({ date, startDate, endDate, role, department, status });

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.userName.toLowerCase().includes(q) ||
          a.userId.toLowerCase().includes(q) ||
          (a.department && a.department.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: list.length, logs: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/attendance/manual-override - Admin override
router.post('/manual-override', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { recordId, userId, date, status, checkIn, checkOut, reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'សូមបញ្ជាក់មូលហេតុនៃការកែប្រែវត្តមាន (Reason log is required)',
      });
    }

    let record = null;
    const targetDate = date || new Date().toISOString().split('T')[0];

    if (recordId) {
      const all = await dbService.getAllAttendance();
      record = all.find((a) => a.id === recordId);
    } else if (userId) {
      record = await dbService.getTodayAttendanceForUser(userId, targetDate);
    }

    if (!record) {
      // Create new manual attendance record
      const targetUser = await dbService.getUserById(userId);
      if (!targetUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      record = {
        userId: targetUser.userId,
        userName: targetUser.name,
        role: targetUser.role,
        department: targetUser.department,
        date: targetDate,
        checkIn: checkIn || '08:00 AM',
        checkInTime: new Date(`${targetDate}T08:00:00Z`).toISOString(),
        checkOut: checkOut || null,
        checkOutTime: checkOut ? new Date(`${targetDate}T17:00:00Z`).toISOString() : null,
        totalHours: checkOut ? '8 ម៉ោង 0 នាទី' : null,
        status: status || 'working',
        method: 'MANUAL_ADMIN_OVERRIDE',
        device: 'Admin Override Panel',
        overrideReason: reason.trim(),
        overriddenBy: req.user.name,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Update existing record
      record.status = status || record.status;
      if (checkIn) record.checkIn = checkIn;
      if (checkOut) record.checkOut = checkOut;
      record.overrideReason = reason.trim();
      record.overriddenBy = req.user.name;
      record.method = 'MANUAL_ADMIN_OVERRIDE';
      record.updatedAt = new Date().toISOString();
    }

    const saved = await dbService.saveAttendanceRecord(record);

    res.json({
      success: true,
      message: 'បានកែប្រែស្ថានភាពវត្តមានដោយជោគជ័យ (Attendance overridden)',
      record: saved,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

