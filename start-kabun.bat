@echo off
setlocal enabledelayedexpansion
title Kabun Coffee + Roastery - Digital Menu Server
color 0E

echo ========================================================
echo        KABUN COFFEE + ROASTERY (ካቡን)
echo      Commercial Digital QR Menu & Admin Suite
echo           "Crafted from coffee."
echo ========================================================
echo.

set "LOCAL_IP=localhost"
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i /c:"IPv4"') do (
    if "!LOCAL_IP!"=="localhost" (
        set "TEMP_IP=%%a"
        set "LOCAL_IP=!TEMP_IP: =!"
    )
)

echo  📡 Local Wi-Fi Network IP:  !LOCAL_IP!
echo.
echo  📱 Customer Menu URL:       http://!LOCAL_IP!:5000
echo  🔐 Manager Admin Portal:    http://!LOCAL_IP!:5000/admin/login
echo  🖥️  Counter / Barista Access: http://localhost:5000
echo.
echo ========================================================
echo Starting Kabun unified server on port 5000...
echo Keep this window open during roastery operating hours.
echo ========================================================
echo.

cd /d "%~dp0friends-restaurant\backend"
start "" http://localhost:5000

node dist/app.js
pause
