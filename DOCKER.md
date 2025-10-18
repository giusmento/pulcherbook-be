# PulcherBook Backend - Docker Deployment Guide

This guide explains how to deploy the PulcherBook backend services using Docker with flexible single-container or multi-container architecture.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Quick Start](#quick-start)
- [Deployment Modes](#deployment-modes)
- [Makefile Commands](#makefile-commands)
- [Configuration](#configuration)
- [Adding New Services](#adding-new-services)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                Nginx (Port 80)                  │
│           Reverse Proxy & Load Balancer         │
└────────────┬────────────────────────────────────┘
             │
             ├──> /api/iam/* ──────> IAM Service (3001)
             ├──> /api/payment/* ──> Payment Service (3002)
             └──> /api/xxx/* ──────> Other Services (300X)
```

### Deployment Modes

#### 1. Single Container Mode (Default)

- All services run in one container
- Lower resource usage
- Simpler deployment
- Ideal for development and small deployments

#### 2. Multi-Container Mode

- Each service in its own container
- Better isolation and scaling
- Independent service updates
- Ideal for production

---

## 🚀 Quick Start

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Make (optional, but recommended)
- GitHub Personal Access Token (for private packages)

### 1. Create GitHub Personal Access Token

Since this project uses private `@giusmento` packages from GitHub Packages, you need a token:

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "PulcherBook Docker Build")
4. Select scopes: **`read:packages`**
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

### 2. Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Important**: Add your GitHub token to `.env`:

```bash
GITHUB_TOKEN=ghp_your_token_here
```

Then export it for Docker builds:

```bash
# Export token to environment (required for Make/Docker)
export GITHUB_TOKEN=ghp_your_token_here

# Verify it's set
echo $GITHUB_TOKEN
```

**Note**: You need to export the token in each new terminal session, or add it to your shell profile (`~/.zshrc` or `~/.bashrc`).

### 3. Build and Deploy

#### 3.1 Single container deployment

Runs all services in one container behind Nginx.

```bash
# Export GitHub token first (if not already done)
export GITHUB_TOKEN=ghp_your_token_here

# Single container deployment (recommended for dev)
make deploy-single
```

#### 3.2 Multi-Container Deployment

Runs one container per service behind Nginx.

```bash
# Export GitHub token first (if not already done)
export GITHUB_TOKEN=ghp_your_token_here

# OR multi-container deployment (recommended for prod)
make deploy-multi
```

### 4. Verify Deployment

```bash
# Check service health
make health

# View logs
make logs

# Check running containers
make ps
```

Your services are now available at:

- **Nginx**: http://localhost
- **IAM Service**: http://localhost/api/iam/

---

## 📝 Makefile Commands

### Build Commands

```bash
make build-all              # Build image with all services
make build-service SERVICES=iam-service  # Build single service
make build-nginx            # Build Nginx image
make build                  # Build all images
```

### Deployment Commands

```bash
make deploy-single          # Deploy all services in single container
make deploy-multi           # Deploy services in separate containers
make up                     # Alias for deploy-single
```

### Management Commands

```bash
make stop                   # Stop all containers
make restart                # Restart all containers
make clean                  # Remove containers, images, volumes
make ps                     # Show running containers
make logs                   # Show logs (all services)
make logs SERVICES=iam-service  # Show logs for specific service
```

### Development Commands

```bash
make shell                  # Open shell in app container
make shell-nginx            # Open shell in Nginx container
make db-shell               # Open PostgreSQL shell
make test                   # Run tests in container
```

### Health & Status Commands

```bash
make health                 # Check health of all services
make status                 # Show full status (health + ps)
```

### Migration Commands

```bash
make migrate                # Run database migrations in Docker
make migrate-local          # Run migrations locally
```

### Utility Commands

```bash
make env                    # Create .env from template
make prune                  # Remove unused Docker resources
make info                   # Show Docker system info
make size                   # Show image sizes
make help                   # Show all available commands
```

---

## ⚙️ Configuration

### Environment Variables (.env)

```bash
# Deployment mode
SERVICES=all                # all | iam-service | payment-service

# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=pulcherbook
DB_USER=postgres
DB_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=1d

# Docker
DOCKER_REGISTRY=pulcherbook
IMAGE_TAG=latest
```

### Service Configuration

Each service can be configured via environment variables in [docker-compose.yml](docker-compose.yml).

---

## ➕ Adding New Services

### 1. Create Service Directory

```bash
mkdir -p services/payment-service
cd services/payment-service
pnpm init
```

### 2. Update docker-compose.yml

Add new service definition:

```yaml
payment-service:
  build:
    context: .
    dockerfile: Dockerfile
    args:
      SERVICES: payment-service
  container_name: pulcherbook-payment-service
  environment:
    - NODE_ENV=${NODE_ENV:-production}
    - SERVICES=payment-service
  ports:
    - "3002:3002"
  networks:
    - pulcherbook-network
  profiles:
    - multi
```

### 3. Update nginx.conf

Add upstream and location block:

```nginx
upstream payment_service {
    server app:3002 max_fails=3 fail_timeout=30s;
}

location /api/payment/ {
    rewrite ^/api/payment/(.*) /$1 break;
    proxy_pass http://payment_service;
    # ... other proxy settings
}
```

### 4. Build and Deploy

```bash
# Build new service
make build-service SERVICES=payment-service

# Deploy
make deploy-multi
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
