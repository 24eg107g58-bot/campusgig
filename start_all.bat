@echo off
title Launch CAMPUSGIG Hub
echo ========================================================
echo   Launching CAMPUSGIG - Freelance Student Hub
echo ========================================================
echo Starting Backend in separate window...
start "CAMPUSGIG Backend" cmd /c "%~dp0start_backend.bat"

echo Waiting 5 seconds for backend initialization...
timeout /t 5 /nobreak > nul

echo Starting Frontend in separate window...
start "CAMPUSGIG Frontend" cmd /c "%~dp0start_frontend.bat"

echo.
echo Both servers have been launched!
echo - Backend:  http://localhost:8080/actuator/health
echo - Frontend: http://localhost:5173
echo.
echo Demo Accounts:
echo - Client:  client@campusgig.com  / password123
echo - Student: alex@campusgig.com    / password123
echo ========================================================
pause
