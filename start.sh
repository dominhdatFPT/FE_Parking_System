#!/bin/bash

# ====================================
# Start Parking System with Docker
# ====================================

set -e

echo "🚀 Starting Parking System..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "📦 Building and starting services..."
docker-compose up -d --build

echo ""
echo "✅ Services started successfully!"
echo ""
echo "📍 Access points:"
echo "   - Frontend:   http://localhost:3000"
echo "   - Backend:    http://localhost:8080"
echo "   - phpMyAdmin: http://localhost:8081 (user: root, pass: root123)"
echo ""
echo "💾 Database:"
echo "   - Host:     localhost"
echo "   - Port:     3306"
echo "   - User:     root"
echo "   - Password: root123"
echo "   - Database: parking_db"
echo ""
echo "📝 Useful commands:"
echo "   - View logs:      docker-compose logs -f frontend"
echo "   - Stop services:  docker-compose down"
echo "   - Remove volumes: docker-compose down -v"
echo ""
