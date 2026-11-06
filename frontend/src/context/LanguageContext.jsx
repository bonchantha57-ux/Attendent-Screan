import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  km: {
    // Nav
    brandTitle: 'ប្រព័ន្ធគ្រប់គ្រងវត្តមាន',
    home: 'ទំព័រដើម',
    kiosk: 'Screen QR មាត់ទ្វារ',
    adminDashboard: 'ផ្ទាំងគ្រប់គ្រង Admin',
    users: 'គ្រប់គ្រងអ្នកប្រើប្រាស់',
    attendanceLogs: 'កំណត់ត្រាវត្តមាន',
    reports: 'របាយការណ៍ & Export',
    logout: 'ចាកចេញ',
    login: 'ចូលប្រព័ន្ធ',
    register: 'ចុះឈ្មោះ',

    // Status Badges
    offDuty: 'មិនទាន់ចូល (Off Duty)',
    working: 'ចូលការងារ (Working)',
    checkedOut: 'ចេញការងារ (Checked Out)',

    // User Dashboard
    scanInBtn: 'ស្កេន QR វត្តមាន',
    todayStatus: 'ស្ថានភាពថ្ងៃនេះ',
    checkInTime: 'ម៉ោងចូល',
    checkOutTime: 'ម៉ោងចេញ',
    totalWorkHours: 'ម៉ោងសរុប',
    recentHistory: 'ប្រវត្តិស្កេនកន្លងមក',
    device: 'ឧបករណ៍',
    distance: 'ចម្ងាយពីស្ថាប័ន',

    // Admin Dashboard
    totalRegistered: 'បុគ្គលិក/សិស្សសរុប',
    presentToday: 'វត្តមានថ្ងៃនេះ',
    absentToday: 'អវត្តមានថ្ងៃនេះ',
    lateArrivals: 'មកយឺត',
    attendanceRate: 'អត្រាវត្តមានសរុប',
    weeklyAttendanceChart: 'ក្រាហ្វិកអត្រាវត្តមានប្រចាំសប្តាហ៍',
    liveScanFeed: 'សកម្មភាពស្កេនផ្ទាល់ (Live)',

    // Actions
    searchPlaceholder: 'ស្វែងរកតាមឈ្មោះ ឬអត្តលេខ...',
    filterDept: 'ជ្រើសរើសដេប៉ាតឺម៉ង់ / ថ្នាក់',
    filterRole: 'ជ្រើសរើសតួនាទី',
    filterStatus: 'ជ្រើសរើសស្ថានភាព',
    addNewUser: 'បន្ថែមគណនីថ្មី',
    manualOverrideBtn: 'កែប្រែវត្តមាន (Manual Override)',
    exportPdf: 'ទាញយក PDF Report',
    exportExcel: 'ទាញយក Excel (.xlsx)',
    save: 'រក្សាទុក',
    cancel: 'បោះបង់',
    reason: 'មូលហេតុ',
  },
  en: {
    brandTitle: 'Universal Attendance System',
    home: 'Dashboard',
    kiosk: 'Gate QR Screen',
    adminDashboard: 'Admin Overview',
    users: 'User Management',
    attendanceLogs: 'Attendance Logs',
    reports: 'Reports & Export',
    logout: 'Log Out',
    login: 'Sign In',
    register: 'Sign Up',

    offDuty: 'Off Duty',
    working: 'Working',
    checkedOut: 'Checked Out',

    scanInBtn: 'Scan Attendance QR',
    todayStatus: "Today's Status",
    checkInTime: 'Check-in Time',
    checkOutTime: 'Check-out Time',
    totalWorkHours: 'Total Hours',
    recentHistory: 'Recent Scan History',
    device: 'Device',
    distance: 'Distance to Campus',

    totalRegistered: 'Total Registered',
    presentToday: 'Present Today',
    absentToday: 'Absent Today',
    lateArrivals: 'Late Arrivals',
    attendanceRate: 'Attendance Rate',
    weeklyAttendanceChart: 'Weekly Attendance Trends',
    liveScanFeed: 'Live Scans Feed',

    searchPlaceholder: 'Search by name or ID...',
    filterDept: 'Filter by Department / Class',
    filterRole: 'Filter by Role',
    filterStatus: 'Filter by Status',
    addNewUser: 'Add New User',
    manualOverrideBtn: 'Manual Override',
    exportPdf: 'Download PDF Report',
    exportExcel: 'Download Excel (.xlsx)',
    save: 'Save Changes',
    cancel: 'Cancel',
    reason: 'Reason Log',
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('attendance_lang') || 'km');

  useEffect(() => {
    localStorage.setItem('attendance_lang', lang);
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'km' ? 'en' : 'km'));
  };

  const t = (key) => translations[lang]?.[key] || translations['en']?.[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

