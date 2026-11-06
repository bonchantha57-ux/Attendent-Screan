const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');
const { dbService } = require('../config/firebase');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.use(authenticateToken, requireRole(['admin']));

// GET /api/reports/dashboard-metrics - Real-time metrics
router.get('/dashboard-metrics', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const allUsers = await dbService.getAllUsers();
    const todayLogs = await dbService.getAllAttendance({ date: today });

    const totalRegistered = allUsers.length;
    const presentToday = todayLogs.filter((l) => l.status === 'working' || l.status === 'checked_out').length;
    const lateArrivals = todayLogs.filter((l) => l.attendanceType === 'late').length;
    const absent = Math.max(0, totalRegistered - presentToday);

    // Weekly analytics data (last 7 days)
    const daysMap = ['អាទិត្យ (Sun)', 'ចន្ទ (Mon)', 'អង្គារ (Tue)', 'ពុធ (Wed)', 'ព្រហស្បតិ៍ (Thu)', 'សុក្រ (Fri)', 'សៅរ៍ (Sat)'];
    const weeklyTrends = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dayName = daysMap[d.getDay()];

      const dayLogs = await dbService.getAllAttendance({ date: dStr });
      const presentCount = dayLogs.filter((l) => l.status === 'working' || l.status === 'checked_out').length;
      const lateCount = dayLogs.filter((l) => l.attendanceType === 'late').length;

      weeklyTrends.push({
        date: dStr,
        day: dayName,
        present: presentCount,
        late: lateCount,
        total: totalRegistered,
      });
    }

    res.json({
      success: true,
      metrics: {
        totalRegistered,
        presentToday,
        absent,
        lateArrivals,
        attendanceRate: totalRegistered > 0 ? Math.round((presentToday / totalRegistered) * 100) : 0,
      },
      weeklyTrends,
      recentActivity: todayLogs.slice(0, 8),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/reports/export-excel - Download Excel (.xlsx)
router.get('/export-excel', async (req, res) => {
  try {
    const { startDate, endDate, department, role, status } = req.query;
    const logs = await dbService.getAllAttendance({ startDate, endDate, department, role, status });

    const excelRows = logs.map((log, index) => ({
      'ល.រ (No)': index + 1,
      'អត្តលេខ (User ID)': log.userId,
      'ឈ្មោះ (Name)': log.userName,
      'តួនាទី (Role)': log.role.toUpperCase(),
      'ថ្នាក់ / ផ្នែក (Department)': log.department || 'N/A',
      'កាលបរិច្ឆេទ (Date)': log.date,
      'ម៉ោងចូល (Check In)': log.checkIn || '-',
      'ម៉ោងចេញ (Check Out)': log.checkOut || '-',
      'ម៉ោងសរុប (Total Hours)': log.totalHours || '-',
      'ស្ថានភាព (Status)': log.status,
      'វិធីសាស្ត្រ (Method)': log.method || 'QR_SCAN',
      'ចម្ងាយ (Distance)': log.distanceMeters ? `${log.distanceMeters}m` : 'Verified',
      'មូលហេតុ Override (Reason)': log.overrideReason || '-',
    }));

    const worksheet = xlsx.utils.json_to_sheet(excelRows);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Attendance_Report');

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Attendance_Report_${Date.now()}.xlsx`);
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

