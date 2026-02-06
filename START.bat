@echo off
echo ====================================
echo   AromaExplorer-Circles - Start
echo ====================================
echo.

REM Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not installed
    echo Please install Node.js first
    pause
    exit /b 1
)

echo [1/4] Checking Node.js...
node --version
npm --version
echo.

echo [2/4] Installing dependencies (first time: ~5 min)...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo [3/4] IMPORTANT: Execute SQL migration in Supabase
echo.
echo 1. Open https://app.supabase.com
echo 2. Go to SQL Editor
echo 3. Copy content from: lib/supabase/migrations/001_setup.sql
echo 4. Paste and RUN in Supabase
echo.
echo Press any key when done...
pause >nul
echo.

echo [4/4] Starting development server...
echo.
echo App will open at: http://localhost:3001
echo (Using port 3001 because 3000 is in use)
echo.
echo IMPORTANT: Keep this window open while using the app
echo To stop: Press Ctrl+C
echo.
call npm run dev -- -p 3001

pause
