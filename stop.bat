@echo off
REM ====================================
REM Stop Parking System (Windows)
REM ====================================

echo.
echo 🛑 Stopping Parking System...
echo.

where docker-compose >nul 2>nul
if errorlevel 1 (
    echo ❌ Docker Compose is not installed.
    pause
    exit /b 1
)

docker-compose down

if errorlevel 1 (
    echo ❌ Failed to stop services.
    pause
    exit /b 1
)

echo.
echo ✅ Services stopped successfully!
echo.
pause
