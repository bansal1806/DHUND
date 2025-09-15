@echo off
echo ========================================
echo Starting DHUND Demo Environment
echo ========================================
echo.

echo Starting Backend Server...
start "DHUND Backend" cmd /k "cd backend && C:\Users\Admin\AppData\Local\Programs\Python\Python313\python.exe main.py"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "DHUND Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo DHUND Demo Started!
echo ========================================
echo.
echo Backend API: http://localhost:8000
echo Frontend App: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo Live Demo: http://localhost:3000/demo
echo.
echo Press any key to open the application...
pause >nul

start http://localhost:3000

echo.
echo Demo is ready for presentation!
echo.
pause

