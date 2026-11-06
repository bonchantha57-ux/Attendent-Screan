# 🚀 Universal Web-Based Attendance Tracking System
### ប្រព័ន្ធគ្រប់គ្រងវត្តមានឆ្លាតវៃ (PWA + Web Admin Portal + Firebase Realtime & Firestore API)

ប្រព័ន្ធនេះត្រូវបានរៀបចំ និងអភិវឌ្ឍយ៉ាងលម្អិតតាម **Functional Requirements Document (FRD)** ដោយបែងចែក Folder **Backend** និង **Frontend** យ៉ាងស្អាត រួមទាំងមានប្រព័ន្ធ `.env` សម្រាប់ដាក់ Firebase Keys និងដំណើរការបានភ្លាមៗ (**Plug-and-Play / ដំណើការបានតែម្ដង**)។

---

## 📁 រចនាសម្ព័ន្ធ Folder (Project Structure)

```text
Attendent Screan/
├── backend/                       # Node.js & Express REST API Server
│   ├── .env                       # កន្លែងដាក់ Firebase Keys & Port
│   ├── .env.example               # គំរូកំណត់រចនាសម្ព័ន្ធ Environment
│   ├── server.js                  # Entrypoint Express Server
│   ├── package.json               # Backend Dependencies
│   ├── config/
│   │   └── firebase.js            # Firebase Admin SDK (Firestore & Realtime Database + Fallback Engine)
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT Auth & Role-Based Access Control (RBAC)
│   ├── routes/
│   │   ├── auth.js                # Register, Login, Me, Demo Accounts
│   │   ├── attendance.js          # Today Status, Scan In/Out, Manual Override
│   │   ├── qr.js                  # Rotating Kiosk QR Generation & Geofence
│   │   ├── users.js               # Admin User Management CRUD
│   │   └── reports.js             # Analytics Metrics, Charts, Excel Export
│   ├── utils/
│   │   ├── qrSecurity.js          # Dynamic HMAC Rotating QR Token (Anti-Screenshot)
│   │   └── geoUtils.js            # Haversine Geofencing Formula
│   └── data/
│       └── store.json             # Local Fallback Data Store (Seeded with demo data)
│
├── frontend/                      # Responsive Web App & Admin Portal (Vite + React + Tailwind CSS)
│   ├── .env                       # Frontend Environment Config
│   ├── .env.example               # Frontend Config Example
│   ├── package.json               # Frontend Dependencies
│   ├── vite.config.js             # Vite Dev Server & Reverse Proxy
│   ├── tailwind.config.js         # Modern Design System & Khmer Typography
│   ├── index.html                 # PWA HTML Entry with Kantumruy Pro & Plus Jakarta Sans
│   ├── public/
│   │   ├── manifest.json          # PWA Web App Manifest
│   │   └── service-worker.js      # Web Push Notifications Service Worker
│   └── src/
│       ├── api/client.js          # API Client with JWT Interceptors
│       ├── context/
│       │   ├── AuthContext.jsx    # Session Authentication & Roles
│       │   └── LanguageContext.jsx# Khmer 🇰🇭 & English 🇬🇧 Bilingual Switcher
│       ├── components/
│       │   ├── Navbar.jsx         # Responsive Navigation, Profile & Language Switch
│       │   ├── StatusBadge.jsx    # Dynamic Badge (Off Duty, Working, Checked-Out)
│       │   ├── QRScannerModal.jsx # Web Camera In-Browser QR Scanner + GPS Check
│       │   └── NotificationBanner.jsx # Web Push Notification Reminder Banner
│       └── pages/
│           ├── Login.jsx          # Sign-in with One-Click Demo Account Quickfill
│           ├── Register.jsx       # Registration with Class/Department Validation
│           ├── UserDashboard.jsx  # Student/Staff Portal with Big Scan Button & Timeline
│           ├── KioskScreen.jsx    # Dynamic Gate Monitor Screen (Rotates every 20s)
│           ├── AdminDashboard.jsx # Real-time Metrics & Weekly Attendance Charts
│           ├── AdminUsers.jsx     # User Management CRUD, Roles, Reset Password
│           ├── AdminAttendance.jsx# Logs & Manual Override with Reason Log
│           └── AdminReports.jsx   # PDF Report with Signature & Excel (.xlsx) Download
│
├── start-dev.bat                  # ចុចពីរដង (Double-Click) ដើម្បីដំណើរការលើ Windows
├── start-dev.ps1                  # PowerShell Startup Script
├── package.json                   # Root scripts
└── README.md                      # ឯកសារណែនាំការប្រើប្រាស់
```

---

## ⚡ របៀបដំណើរការប្រព័ន្ធ (Quick Start)

### ជម្រើសទី ១ (ស្រួលបំផុតលើ Windows)
គ្រាន់តែចុចពីរដង (Double-click) លើឯកសារ `start-dev.bat` វានឹងបើកដំណើរការទាំង Backend និង Frontend ក្នុងពេលតែមួយដោយស្វ័យប្រវត្តិ!

### ជម្រើសទី ២ (តាម Terminal / Command Line)

**១. បើកដំណើរការ Backend:**
```bash
cd backend
npm run dev
# ឬ npm start
```
*Backend ដំណើរការលើ:* `http://localhost:5000/api`

**២. បើកដំណើរការ Frontend:**
```bash
cd frontend
npm run dev
```
*Frontend ដំណើរការលើ:* `http://localhost:3000`

---

## 🔑 កន្លែងដាក់ Firebase Keys ក្នុង `.env`

ចូលទៅកាន់ `backend/.env` ហើយបំពេញព័ត៌មាន Firebase របស់អ្នក (ទាញយកពី Firebase Console > Project Settings > Service Accounts):

```env
# backend/.env
PORT=5000
JWT_SECRET=super_secret_jwt_attendance_key_2026_xyz987

# --- FIREBASE FIRESTORE & REALTIME DATABASE ---
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASC...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com

# --- GEOFENCING CONFIGURATION ---
GEOFENCE_ENABLED=false           # ដាក់ true ដើម្បីចាប់ GPS បរិវេណជាក់ស្តែង
GEOFENCE_LAT=11.5564             # រាជធានីភ្នំពេញ (កែតាមទីតាំងជាក់ស្តែងរបស់អ្នក)
GEOFENCE_LNG=104.9282
GEOFENCE_RADIUS_METERS=200       # ចម្ងាយអនុញ្ញាត (ម៉ែត្រ)

# --- DYNAMIC SCREEN QR ROTATION ---
QR_ROTATION_INTERVAL_SECONDS=20
```

> **ចំណាំសំខាន់:** ទោះបីជាអ្នកមិនទាន់បានដាក់ Firebase Keys ក៏ដោយ ក៏ប្រព័ន្ធ **នៅតែអាចដំណើរការបានភ្លាមៗ ១០០% (Plug-and-Play)** ដោយសារមានប្រព័ន្ធ **High-Fidelity Local Fallback Storage** ជួយស្តុកទុកទិន្នន័យក្នុង `backend/data/store.json`។ នៅពេលអ្នកដាក់ Firebase Keys វានឹងប្តូរទៅភ្ជាប់ Google Firebase Firestore និង Realtime Database ដោយស្វ័យប្រវត្តិ!

---

## 👤 គណនីគំរូសម្រាប់តេស្ត (Demo Accounts)

នៅលើផ្ទាំង Login មានប៊ូតុង **One-Click Quick Login** សម្រាប់ចុចចូលតេស្តភ្លាមៗ៖

| តួនាទី (Role) | អត្តលេខ (User ID) | ពាក្យសម្ងាត់ (Password) | ឈ្មោះ |
|---|---|---|---|
| 👑 **Admin** | `ADM-001` | `admin123` | លោក ចាន់ថា (Admin) |
| 👨‍🏫 **Staff** | `STF-101` | `staff123` | សាស្ត្រាចារ្យ សុខា |
| 🎓 **Student** | `STU-201` | `student123` | និស្សិត វីរៈ |

---

## 🌟 មុខងារសំខាន់ៗដែលបានបំពេញតាម FRD

### ១. User Web App (Responsive PWA - Mobile & Laptop)
- **Sign-up & Login:** បង្កើតគណនីជាមួយឈ្មោះ, អត្តលេខ, ថ្នាក់/ដេប៉ាតឺម៉ង់ និង Password (ផ្ទៀងផ្ទាត់មិនឱ្យស្ទួន ID)។
- **Dynamic Status Badge:**
  - 🔴 **Off Duty / មិនទាន់ចូល:** នៅពេលមិនទាន់មាន Record Scan
  - 🟢 **Working / ចូលការងារ:** ប្តូរភ្លាមៗបន្ទាប់ពី Scan Check-in
  - 🔵 **Checked-Out / ចេញការងារ:** ប្តូរបន្ទាប់ពី Scan Check-out និងគណនាម៉ោងធ្វើការសរុប (Total Work Hours)
- **Web Camera QR Scan:** ដំណើរការកាមេរ៉ាក្នុង browser ផ្ទាល់ (`html5-qrcode`) មាន Viewfinder Laser, សំឡេង Chime, និង Confetti អបអរសាទរ!
- **Web Push Notifications:** ស្នើសុំសិទ្ធិ Notification និងបាញ់ដាស់តឿននៅពេលដល់ម៉ោង Scan Check-out។

### ២. Gate Monitor / Kiosk Screen (Screen QR មាត់ទ្វារ)
- បង្ហាញលើទូរទស្សន៍/Tablet នៅមាត់ទ្វារចូល។
- **Dynamic Rotating QR Code:** កូដ Rotate/Refresh រៀងរាល់ **២០ វិនាទីម្តង** ដោយប្រើ **HMAC Cryptographic Signature** ការពារដាច់ខាតកុំឱ្យ User លួចថតរូបផ្ញើឱ្យគ្នា Scan ពីផ្ទះ!
- បង្ហាញនាឡិកា Live Clock, របាររាប់ថយក្រោយ (Countdown Progress Bar), និងប៊ូតុង Fullscreen Mode។

### ៣. Web Admin Portal
- **Real-Time Analytics Dashboard:**
  - Metric Cards: បុគ្គលិក/សិស្សសរុប, វត្តមានថ្ងៃនេះ, អវត្តមាន, មកយឺត (Late Arrivals)
  - ក្រាហ្វិកប្រចាំសប្តាហ៍ (Weekly Attendance Bar Chart) និងសមាមាត្រវត្តមានថ្ងៃនេះ (Doughnut Chart)
  - Live Feed នៃការ Scan ជាក់ស្តែង
- **User Management:**
  - បញ្ជី User Table (Search, Filter តាម Department/Class)
  - បង្កើតគណនីថ្មី, កែប្រែឈ្មោះ/ថ្នាក់, Block/Unblock, Delete, និង Reset Password
- **Attendance Logs & Manual Override:**
  - តារាងកត់ត្រាម៉ោង Check-in, Check-out, Total Hours, និង Geofence distance
  - **Manual Override:** Admin អាចកែប្រែវត្តមានដោយផ្ទាល់ (ឧ. Absent -> Present ឬ Permission/ច្បាប់) ដោយមាន **Reason Log** ជាកាតព្វកិច្ច
- **Reporting Engine & Export:**
  - **Export PDF:** បង្កើតរបាយការណ៍ស្អាត មាន Logo ស្ថាប័ន, តារាងវត្តមាន, និងកន្លែងចុះហត្ថលេខា ៣ ថ្នាក់ (Prepared By, Verified By, Approved By / Director)
  - **Export Excel (.xlsx):** ទាញយក Raw Data ទៅគណនាប្រាក់បៀវត្សរ៍ ឬបញ្ចូលក្នុងប្រព័ន្ធផ្សេង

### ៤. សុវត្ថិភាពកម្រិតខ្ពស់ (Security Constraints)
- **Web Geofencing (GPS Verification):** ផ្ទៀងផ្ទាត់កូអរដោនេ GPS តាមរយៈ Haversine formula ដើម្បីធានាថាអ្នក Scan កំពុងស្ថិតក្នុងបរិវេណស្ថាប័នពិតប្រាកដ។
- **Bilingual Interface:** គាំទ្រភាសាខ្មែរ 🇰🇭 និងអង់គ្លេស 🇬🇧 យ៉ាងពេញលេញ។

