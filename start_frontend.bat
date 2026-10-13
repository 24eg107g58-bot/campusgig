@echo off
title CAMPUSGIG - Vite Frontend (Port 5173)
echo ========================================================
echo   Starting CAMPUSGIG Frontend (React + Vite)
echo   URL: http://localhost:5173
echo ========================================================
set "PATH=C:\Program Files\nodejs;%PATH%"

cd /d "%~dp0frontend"
npm run dev
pause
