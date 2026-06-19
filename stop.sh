#!/bin/bash

# ====================================
# Stop Parking System
# ====================================

set -e

echo "🛑 Stopping Parking System..."
echo ""

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed."
    exit 1
fi

docker-compose down

echo "✅ Services stopped successfully!"
echo ""
