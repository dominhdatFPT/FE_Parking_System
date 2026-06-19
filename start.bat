@echo off
REM ====================================
REM Start Parking System with Docker (Windows)
REM ====================================

echo.
echo 🚀 Starting Parking System...
echo.

where docker >nul 2>nul
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

where docker-compose >nul 2>nul
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

echo 📦 Building and starting services...
docker-compose up -d --build

if errorlevel 1 (
    echo ❌ Failed to start services.
    pause
    exit /b 1
)

echo.
echo ✅ Services started successfully!
echo.
echo 📍 Access points:
echo    - Frontend:   http://localhost:3000
echo    - Backend:    http://localhost:8080
echo    - phpMyAdmin: http://localhost:8081 (user: root, pass: root123)
echo.
echo 💾 Database:
echo    - Host:     localhost
echo    - Port:     3306
echo    - User:     root
echo    - Password: root123
echo    - Database: parking_db
echo.
echo 📝 Useful commands:
echo    - View logs:      docker-compose logs -f frontend
echo    - Stop services:  docker-compose down
echo    - Remove volumes: docker-compose down -v
echo.
pause
