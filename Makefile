.PHONY: help build up down logs restart clean shell test

DOCKER_COMPOSE := docker-compose

help:
	@echo "🐳 Parking System - Docker Commands"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  build          - Build Docker images"
	@echo "  up             - Start all services"
	@echo "  up-prod        - Start with production config"
	@echo "  down           - Stop all services"
	@echo "  restart        - Restart services"
	@echo "  logs           - View logs (all services)"
	@echo "  logs-fe        - View frontend logs"
	@echo "  logs-be        - View backend logs"
	@echo "  logs-db        - View database logs"
	@echo "  shell-fe       - SSH into frontend container"
	@echo "  shell-be       - SSH into backend container"
	@echo "  shell-db       - SSH into database container"
	@echo "  clean          - Stop and remove containers"
	@echo "  clean-all      - Remove containers, volumes, and images"
	@echo "  status         - Show container status"
	@echo "  test           - Run tests"
	@echo "  prune          - Clean up Docker unused resources"
	@echo ""

build:
	@echo "📦 Building images..."
	$(DOCKER_COMPOSE) build

up:
	@echo "🚀 Starting services..."
	$(DOCKER_COMPOSE) up -d --build
	@echo "✅ Services started!"
	@echo "📍 Access: http://localhost:3000"

down:
	@echo "🛑 Stopping services..."
	$(DOCKER_COMPOSE) down

restart: down up
	@echo "🔄 Services restarted!"

logs:
	$(DOCKER_COMPOSE) logs -f

logs-fe:
	$(DOCKER_COMPOSE) logs -f frontend

logs-be:
	$(DOCKER_COMPOSE) logs -f backend

logs-db:
	$(DOCKER_COMPOSE) logs -f mysql

shell-fe:
	docker exec -it parking-system-fe sh

shell-be:
	docker exec -it parking-system-backend bash

shell-db:
	docker exec -it parking-system-db mysql -uroot -proot123

status:
	$(DOCKER_COMPOSE) ps

clean:
	@echo "🧹 Cleaning containers..."
	$(DOCKER_COMPOSE) down

clean-all:
	@echo "🧹 Cleaning everything..."
	$(DOCKER_COMPOSE) down -v
	@echo "✅ Cleaned!"

test:
	@echo "🧪 Running tests..."
	$(DOCKER_COMPOSE) exec frontend npm test

prune:
	@echo "🧹 Pruning Docker resources..."
	docker system prune -af --volumes

ps:
	$(DOCKER_COMPOSE) ps

pull:
	$(DOCKER_COMPOSE) pull

push:
	@echo "📤 Pushing images (if configured)..."
	docker-compose push

validate:
	@echo "✅ Validating docker-compose.yml..."
	$(DOCKER_COMPOSE) config
