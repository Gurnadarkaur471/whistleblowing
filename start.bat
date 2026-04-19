@echo off
title SecureVoice – Setup & Start
color 0A

echo.
echo  =====================================================
echo   SecureVoice – Anonymous Whistleblowing System
echo  =====================================================
echo.

:: Check Node.js
node --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
  echo  [ERROR] Node.js not found!
  echo  Please install Node.js from: https://nodejs.org
  pause
  exit /b 1
)
echo  [OK] Node.js found: 
node --version

:: Check MongoDB
echo  [INFO] Checking MongoDB...
sc query MongoDB >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
  echo  [WARN] MongoDB service not detected. Make sure MongoDB is running.
  echo  Download from: https://www.mongodb.com/try/download/community
  echo.
)

:: Install dependencies
echo.
echo  [1/3] Installing dependencies...
call npm install
IF %ERRORLEVEL% NEQ 0 (
  echo  [ERROR] npm install failed!
  pause
  exit /b 1
)
echo  [OK] Dependencies installed.

:: Create logs folder
if not exist logs mkdir logs
if not exist uploads mkdir uploads
echo  [OK] Directories ready.

:: Run setup (create admin)
echo.
echo  [2/3] Setting up admin account...
node setup.js

:: Start server
echo.
echo  [3/3] Starting SecureVoice server...
echo.
echo  =====================================================
echo   App running at: http://localhost:3000
echo   Admin panel  : http://localhost:3000/admin/login
echo   Email        : admin@securevoice.gov
echo   Password     : Admin@SecureVoice2024
echo  =====================================================
echo.
node server.js
pause
