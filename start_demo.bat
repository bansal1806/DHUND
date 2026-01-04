@echo off
echo ========================================
echo Starting DHUND Backend API Server
echo ========================================
echo.

echo Starting Backend Server...
set TF_ENABLE_ONEDNN_OPTS=0
set TF_CPP_MIN_LOG_LEVEL=2

REM Use py (Python Launcher) if available, otherwise fallback to python
py --version >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON_CMD=py
) else (
    set PYTHON_CMD=python
)

%PYTHON_CMD% -m backend.main

if errorlevel 1 (
    echo.
    echo ERROR: Failed to start backend server
    echo Please ensure Python is installed and backend dependencies are installed:
    echo   cd backend
    echo   pip install -r requirements.txt
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo DHUND Backend API Started!
echo ========================================
echo.
echo Backend API: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo Interactive API: http://localhost:8000/redoc
echo.
echo Press Ctrl+C to stop the server
echo.
