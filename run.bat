@echo off
echo ========================================================
echo   🌱 Starting EcoLoop Full-Stack Application
echo   "Turning Leftovers into Leverages"
echo ========================================================

echo Starting EcoLoop Backend API on port 5000...
start "EcoLoop Backend (Port 5000)" cmd /k "cd backend && npm run dev"

echo Starting EcoLoop Frontend on port 5173...
start "EcoLoop Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

echo ========================================================
echo   ✅ Both servers launched!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo ========================================================
pause
