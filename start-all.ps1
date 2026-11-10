Write-Host "========================================================" -ForegroundColor Green
Write-Host "  🌱 EcoLoop Full-Stack Application Launcher" -ForegroundColor Green
Write-Host "  Turning Leftovers into Leverages" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Green

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm.cmd run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm.cmd run dev"

Write-Host "Servers launched in dedicated background consoles:" -ForegroundColor Yellow
Write-Host "  - Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  - Backend:  http://localhost:5000" -ForegroundColor Cyan
