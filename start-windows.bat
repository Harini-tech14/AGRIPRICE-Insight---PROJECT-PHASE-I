@echo off
title AgriPrice Insight - Local Development Server
echo ========================================================
echo   AgriPrice Insight - Setup and Launch
echo ========================================================
echo.
echo Installing dependencies...
call npm install --legacy-peer-deps
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] npm install encountered an error.
    pause
    exit /b %ERRORLEVEL%
)
echo.
echo [OK] Dependencies installed successfully!
echo.
echo Starting Vite local dev server on http://localhost:3000 ...
echo Press Ctrl+C in this window anytime to stop the server.
echo.
call npm run dev
pause
