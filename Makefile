.PHONY: help build-all build-service deploy-single deploy-multi stop clean logs test

# Default environment variables
SERVICES ?= all
NODE_VERSION ?= 18-alpine
DOCKER_REGISTRY ?= pulcherbook
IMAGE_TAG ?= latest

# Colors for output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RED    := \033[0;31m
NC     := \033[0m # No Color

# =============================================================================
# Help
# =============================================================================
help: ## Show this help message
	@echo '$(GREEN)PulcherBook Backend - Docker Management$(NC)'
	@echo ''
	@echo 'Usage:'
	@echo '  make $(YELLOW)<target>$(NC)'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# =============================================================================
# Build Commands
# =============================================================================
build-all: ## Build Docker image with all services
	@echo "$(GREEN)Building image with all services...$(NC)"
	@if [ -z "$(GITHUB_TOKEN)" ]; then \
		echo "$(YELLOW)Warning: GITHUB_TOKEN not set. If using private GitHub packages, build will fail.$(NC)"; \
	fi
	docker build \
		--build-arg SERVICES=all \
		--build-arg NODE_VERSION=$(NODE_VERSION) \
		--build-arg GITHUB_TOKEN=$(GITHUB_TOKEN) \
		-t $(DOCKER_REGISTRY)/backend:$(IMAGE_TAG) \
		-t $(DOCKER_REGISTRY)/backend:all-$(IMAGE_TAG) \
		-f Dockerfile .
	@echo "$(GREEN)✓ Build completed: $(DOCKER_REGISTRY)/backend:all-$(IMAGE_TAG)$(NC)"

build-service: ## Build Docker image for a single service (usage: make build-service SERVICES=iam-service)
	@if [ "$(SERVICES)" = "all" ]; then \
		echo "$(RED)Error: Please specify a service name. Usage: make build-service SERVICES=iam-service$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Building image for service: $(SERVICES)...$(NC)"
	@if [ -z "$(GITHUB_TOKEN)" ]; then \
		echo "$(YELLOW)Warning: GITHUB_TOKEN not set. If using private GitHub packages, build will fail.$(NC)"; \
	fi
	docker build \
		--build-arg SERVICES=$(SERVICES) \
		--build-arg NODE_VERSION=$(NODE_VERSION) \
		--build-arg GITHUB_TOKEN=$(GITHUB_TOKEN) \
		-t $(DOCKER_REGISTRY)/backend:$(SERVICES)-$(IMAGE_TAG) \
		-f Dockerfile .
	@echo "$(GREEN)✓ Build completed: $(DOCKER_REGISTRY)/backend:$(SERVICES)-$(IMAGE_TAG)$(NC)"

build-nginx: ## Build Nginx reverse proxy image
	@echo "$(GREEN)Building Nginx image...$(NC)"
	docker build -t $(DOCKER_REGISTRY)/nginx:$(IMAGE_TAG) -f nginx/Dockerfile .
	@echo "$(GREEN)✓ Nginx build completed$(NC)"

build: build-all build-nginx ## Build all images (app + nginx)

# =============================================================================
# Deployment Commands
# =============================================================================
deploy-single: ## Deploy all services in a single container with Nginx
	@echo "$(GREEN)Deploying in single-container mode...$(NC)"
	SERVICES=all docker-compose --profile single up -d
	@echo "$(GREEN)✓ Deployment completed$(NC)"
	@echo "$(YELLOW)Services available at:$(NC)"
	@echo "  - http://localhost/api/iam/"
	@make ps

deploy-multi: ## Deploy each service in separate containers with Nginx
	@echo "$(GREEN)Deploying in multi-container mode...$(NC)"
	docker-compose --profile multi up -d
	@echo "$(GREEN)✓ Deployment completed$(NC)"
	@echo "$(YELLOW)Services available at:$(NC)"
	@echo "  - http://localhost/api/iam/"
	@make ps

up: deploy-single ## Alias for deploy-single

# =============================================================================
# Management Commands
# =============================================================================
stop: ## Stop all running containers
	@echo "$(YELLOW)Stopping all containers...$(NC)"
	docker-compose --profile single --profile multi down
	@echo "$(GREEN)✓ All containers stopped$(NC)"

restart: stop deploy-single ## Restart all containers

clean: stop ## Remove all containers, images, and volumes
	@echo "$(YELLOW)Cleaning up Docker resources...$(NC)"
	docker-compose --profile single --profile multi down -v --rmi local
	@echo "$(GREEN)✓ Cleanup completed$(NC)"

ps: ## Show running containers
	@docker-compose ps

logs: ## Show logs from all containers (usage: make logs [SERVICES=iam-service])
	@if [ "$(SERVICES)" = "all" ] || [ -z "$(SERVICES)" ]; then \
		docker-compose logs -f; \
	else \
		docker-compose logs -f $(SERVICES); \
	fi

logs-app: ## Show logs from app container only
	docker-compose logs -f app

logs-nginx: ## Show logs from nginx container only
	docker-compose logs -f nginx

# =============================================================================
# Development Commands
# =============================================================================
shell: ## Open shell in app container
	docker-compose exec app sh

shell-nginx: ## Open shell in nginx container
	docker-compose exec nginx sh

db-shell: ## Open PostgreSQL shell
	docker-compose exec postgres psql -U postgres -d pulcherbook

# =============================================================================
# Testing Commands
# =============================================================================
test: ## Run tests inside Docker container
	@echo "$(GREEN)Running tests...$(NC)"
	docker-compose exec app pnpm test

test-local: ## Run tests locally (requires Node.js and pnpm)
	@echo "$(GREEN)Running tests locally...$(NC)"
	pnpm test

# =============================================================================
# Health Check Commands
# =============================================================================
health: ## Check health of all services
	@echo "$(GREEN)Checking service health...$(NC)"
	@echo ""
	@echo "$(YELLOW)Nginx:$(NC)"
	@curl -s http://localhost/health || echo "$(RED)✗ Nginx not responding$(NC)"
	@echo ""
	@echo "$(YELLOW)IAM Service (via Nginx):$(NC)"
	@curl -s http://localhost/api/iam/health || echo "$(RED)✗ IAM service not responding$(NC)"
	@echo ""

status: health ps ## Show status of all services

# =============================================================================
# Migration Commands
# =============================================================================
migrate: ## Run database migrations
	@echo "$(GREEN)Running database migrations...$(NC)"
	docker-compose exec app sh -c "cd services/iam-service && pnpm run migration:run"

migrate-local: ## Run database migrations locally
	@echo "$(GREEN)Running database migrations locally...$(NC)"
	cd services/iam-service && pnpm run migration:run

# =============================================================================
# Utility Commands
# =============================================================================
env: ## Create .env file from template
	@if [ ! -f .env ]; then \
		echo "$(GREEN)Creating .env file...$(NC)"; \
		cp .env.example .env 2>/dev/null || echo "NODE_ENV=production\nSERVICES=all\nDB_HOST=postgres\nDB_PORT=5432\nDB_NAME=pulcherbook\nDB_USER=postgres\nDB_PASSWORD=postgres\nJWT_SECRET=change-me-in-production\nJWT_EXPIRES_IN=1d" > .env; \
		echo "$(GREEN)✓ .env file created$(NC)"; \
	else \
		echo "$(YELLOW).env file already exists$(NC)"; \
	fi

prune: ## Remove unused Docker resources
	@echo "$(YELLOW)Removing unused Docker resources...$(NC)"
	docker system prune -f
	@echo "$(GREEN)✓ Prune completed$(NC)"

# =============================================================================
# Production Commands
# =============================================================================
prod-build: ## Build production-ready images
	@echo "$(GREEN)Building production images...$(NC)"
	NODE_ENV=production make build
	@echo "$(GREEN)✓ Production build completed$(NC)"

prod-deploy: ## Deploy to production (single container mode)
	@echo "$(GREEN)Deploying to production...$(NC)"
	NODE_ENV=production make deploy-single
	@echo "$(GREEN)�� Production deployment completed$(NC)"

# =============================================================================
# Info Commands
# =============================================================================
info: ## Show Docker system information
	@echo "$(GREEN)Docker System Information:$(NC)"
	@echo ""
	@docker version
	@echo ""
	@docker-compose version

size: ## Show image sizes
	@echo "$(GREEN)Image Sizes:$(NC)"
	@docker images | grep $(DOCKER_REGISTRY)
