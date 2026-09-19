@echo off
title AssetIQ - Startup
echo.
echo  ==========================================
echo   AssetIQ - Asset Inventory Management
echo   Starting all services...
echo  ==========================================
echo.

echo [1/2] Starting Backend (Port 4000)...
start "AssetIQ Backend" cmd /k "cd /d d:\Asset inventory\backend && npm run dev"

timeout /t 4 /nobreak >nul

echo [2/2] Starting Frontend (Port 3002)...
start "AssetIQ Frontend" cmd /k "cd /d d:\Asset inventory && npm run dev -- --port 3002"

timeout /t 5 /nobreak >nul

echo.
echo  ==========================================
echo   All services started!
echo   Open browser: http://localhost:3002
echo   Email:    admin@assetiq.com
echo   Password: Admin@123
echo  ==========================================
echo.
pause
