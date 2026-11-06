@echo off
echo ============================================================
echo   UNIVERSAL WEB-BASED ATTENDANCE TRACKING SYSTEM
echo   Responsive PWA + Web Admin Portal + Firebase Backend
echo ============================================================
echo.
echo Starting Backend API (Port 5000)...
start "Attendance Backend" cmd /k "cd backend && npm start"

timeout /t 2 >nul

echo Starting Frontend Web App (Port 3000)...
start "Attendance Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo System started!
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000/api
echo ============================================================
pause

