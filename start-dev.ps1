Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  UNIVERSAL WEB-BASED ATTENDANCE TRACKING SYSTEM" -ForegroundColor Green
Write-Host "  Responsive PWA + Web Admin Portal + Firebase Backend" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "`nSystem started!" -ForegroundColor Green
Write-Host "Frontend:    http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:5000/api" -ForegroundColor Cyan

