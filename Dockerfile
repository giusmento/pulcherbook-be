ARG NODE_VERSION=lts-bookworm-slim

# ============================================================================
# Base Stage - Common dependencies
# ============================================================================
FROM docker.io/node:${NODE_VERSION} AS base
WORKDIR /app

# Update package lists and upgrade system packages
RUN apt-get update && apt-get upgrade -y && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install PM2 globally
RUN npm install pm2 -g

# ============================================================================
# Dependencies Stage - Install all dependencies
# ============================================================================
FROM base AS dependencies

ARG GITHUB_TOKEN

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy .npmrc for GitHub Packages authentication
COPY .npmrc ./

# Set GitHub token for npm authentication
RUN echo "Checking GITHUB_TOKEN..." && \
    if [ -z "$GITHUB_TOKEN" ]; then \
      echo "ERROR: GITHUB_TOKEN is not set!"; \
      echo "Please run: docker build --build-arg GITHUB_TOKEN=\$GITHUB_TOKEN ..."; \
      exit 1; \
    fi && \
    printf "//npm.pkg.github.com/:_authToken=%s\n" "$GITHUB_TOKEN" >> .npmrc


# Copy services directory (node_modules excluded by .dockerignore)
COPY services ./services/
# Install dependencies
RUN pnpm install --frozen-lockfile

# Remove .npmrc for security (don't include token in final image)
RUN rm -f .npmrc

# ============================================================================
# Builder Stage - Build TypeScript services
# ============================================================================
FROM dependencies AS builder

# Build all services by default
ARG SERVICES=all

# Expose ports (3001-3010 for multiple services)
EXPOSE 3001 3002 3003 3004 3005

# Copy source code files only (preserving pnpm workspace structure and node_modules)
COPY tsconfig.json* ./

CMD ["pnpm", "start:prod:docker"]
