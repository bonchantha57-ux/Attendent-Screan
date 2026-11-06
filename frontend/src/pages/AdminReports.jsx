import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet,
  FileText,
  Calendar,
  Filter,
  Download,
  Building,
  UserCheck,
  CheckCircle2,
  Clock,
  Printer,
} from 'lucide-react';

export default function AdminReports() {
  const { lang, t } = useLanguage();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const today = new Date().toISOString().split('T')[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split('T')[0];

  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(today);
  const [department, setDepartment] = useState('all');
  const [role, setRole] = useState('all');

  const departments = [
    'Management & IT Directorate',
    'Computer Science & Software',
    'Computer Science - Year 3',
    'Information Technology - Year 2',
    'Graphic Design - Year 1',
    'Faculty & Staff Team',
  ];

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (department !== 'all') params.department = department;
      if (role !== 'all') params.role = role;

      const res = await api.getLogs(params);
      if (res.success) {
        setLogs(res.logs);
      }
    } catch (err) {
      console.error('Fetch reports error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [startDate, endDate, department, role]);

  // Export to Excel (.xlsx)
  const exportToExcel = () => {
    const dataToExport = logs.map((log, index) => ({
      'No.': index + 1,
      'User ID': log.userId,
      'Full Name': log.userName,
      'Role': log.role.toUpperCase(),
      'Department / Class': log.department || 'N/A',
      'Date': log.date,
      'Check-in': log.checkIn || '-',
      'Check-out': log.checkOut || '-',
      'Total Hours': log.totalHours || '-',
      'Status': log.status.toUpperCase(),
      'Method': log.overrideReason ? `Override (${log.overrideReason})` : log.method || 'QR_SCAN',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');
    XLSX.writeFile(workbook, `Attendance_Report_${startDate}_to_${endDate}.xlsx`);
  };

  // Export to PDF Document with Signature Block & Institutional Layout
  const exportToPDF = () => {
    const doc = new jsPDF('landscape');

    // Title & Header Banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 297, 25, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('UNIVERSAL ATTENDANCE TRACKING SYSTEM', 14, 12);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('OFFICIAL INSTITUTIONAL ATTENDANCE REPORT & AUDIT TRAIL', 14, 19);

    // Meta details
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Report Period: ${startDate} to ${endDate}`, 14, 34);
    doc.text(`Department: ${department === 'all' ? 'All Departments' : department}`, 14, 40);
    doc.text(`Total Records: ${logs.length}`, 220, 34);
    doc.text(`Generated At: ${new Date().toLocaleString()}`, 220, 40);

    // Table Content
    const tableHeaders = [
      ['#', 'User ID', 'Full Name', 'Role', 'Department', 'Date', 'Check In', 'Check Out', 'Hours', 'Status'],
    ];

    const tableRows = logs.map((l, i) => [
      i + 1,
      l.userId,
      l.userName,
      l.role.toUpperCase(),
      l.department || '-',
      l.date,
      l.checkIn || '-',
      l.checkOut || '-',
      l.totalHours || '-',
      l.status.toUpperCase(),
    ]);

    autoTable(doc, {
      startY: 46,
      head: tableHeaders,
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [16, 185, 129], // emerald-500
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      styles: {
        fontSize: 8,
        cellPadding: 3,
        textColor: [30, 41, 59],
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: { left: 14, right: 14 },
    });

    // Signatures and Stamps Section
    const finalY = doc.lastAutoTable.finalY + 20;

    if (finalY < 185) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);

      // Signature Columns
      doc.text('Prepared By:', 30, finalY);
      doc.line(30, finalY + 18, 90, finalY + 18);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.text('(Attendance Officer)', 30, finalY + 23);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Verified By:', 120, finalY);
      doc.line(120, finalY + 18, 180, finalY + 18);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.text('(Head of Department)', 120, finalY + 23);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Approved By / Director:', 210, finalY);
      doc.line(210, finalY + 18, 270, finalY + 18);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.text('(Official Seal & Signature)', 210, finalY + 23);
    }

    doc.save(`Attendance_Official_Report_${startDate}_${endDate}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            {lang === 'km' ? 'របាយការណ៍ & ទាញយកទិន្នន័យ' : 'Reports & Export'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'km'
              ? 'ទាញយករបាយការណ៍ជា PDF (មានកន្លែងចុះហត្ថលេខា) និង Excel (.xlsx) សម្រាប់បើកប្រាក់បៀវត្សរ៍'
              : 'Export official PDF documents with signatures or raw Excel sheets for payroll'}
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={exportToExcel}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{t('exportExcel')}</span>
          </button>

          <button
            onClick={exportToPDF}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>{t('exportPdf')}</span>
          </button>
        </div>
      </div>

      {/* Filter Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="w-full md:w-auto grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          {/* Start Date */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200">
            <span className="text-slate-400 font-semibold">{lang === 'km' ? 'ពី៖' : 'From:'}</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-white outline-none cursor-pointer w-full"
            />
          </div>

          {/* End Date */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200">
            <span className="text-slate-400 font-semibold">{lang === 'km' ? 'ដល់៖' : 'To:'}</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-white outline-none cursor-pointer w-full"
            />
          </div>

          {/* Department Filter */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500"
          >
            <option value="all">{lang === 'km' ? 'គ្រប់ដេប៉ាតឺម៉ង់' : 'All Departments'}</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Role Filter */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500"
          >
            <option value="all">{lang === 'km' ? 'គ្រប់តួនាទី' : 'All Roles'}</option>
            <option value="staff">Staff</option>
            <option value="student">Student</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          {logs.length} records selected
        </div>
      </div>

      {/* Report Preview Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-sm sm:text-base">
            {lang === 'km' ? 'ផ្ទាំងមើលទិន្នន័យជាមុន (Data Preview)' : 'Report Preview & Summary'}
          </h3>
          <span className="text-xs text-emerald-400 font-mono">Ready to Export</span>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3 sm:px-4">#</th>
                  <th className="py-3 px-3 sm:px-4">អត្តលេខ</th>
                  <th className="py-3 px-3 sm:px-4">ឈ្មោះ</th>
                  <th className="py-3 px-3 sm:px-4">ដេប៉ាតឺម៉ង់</th>
                  <th className="py-3 px-3 sm:px-4">កាលបរិច្ឆេទ</th>
                  <th className="py-3 px-3 sm:px-4">ម៉ោងចូល</th>
                  <th className="py-3 px-3 sm:px-4">ម៉ោងចេញ</th>
                  <th className="py-3 px-3 sm:px-4">ម៉ោងសរុប</th>
                  <th className="py-3 px-3 sm:px-4">ស្ថានភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-10 text-center text-slate-400 text-xs">
                      {lang === 'km' ? 'មិនមានទិន្នន័យក្នុងចន្លោះកាលបរិច្ឆេទនេះទេ' : 'No records found for this period'}
                    </td>
                  </tr>
                ) : (
                  logs.map((log, index) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 sm:px-4 text-slate-500">{index + 1}</td>
                      <td className="py-3 px-3 sm:px-4 font-mono font-bold text-white">{log.userId}</td>
                      <td className="py-3 px-3 sm:px-4 font-semibold text-slate-100">{log.userName}</td>
                      <td className="py-3 px-3 sm:px-4 text-slate-300">{log.department}</td>
                      <td className="py-3 px-3 sm:px-4 font-mono text-slate-300">{log.date}</td>
                      <td className="py-3 px-3 sm:px-4 font-mono text-emerald-400">{log.checkIn || '-'}</td>
                      <td className="py-3 px-3 sm:px-4 font-mono text-blue-400">{log.checkOut || '-'}</td>
                      <td className="py-3 px-3 sm:px-4 text-slate-300 font-medium">{log.totalHours || '-'}</td>
                      <td className="py-3 px-3 sm:px-4">
                        <span className="capitalize font-semibold text-xs text-white">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
