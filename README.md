# PulcherBook Backend - MangoJS Microservices Monorepo

A pnpm workspace monorepo for building backend microservices using the MangoJS framework.

## Project Overview

This monorepo uses MangoJS to build scalable microservices with:

- **Architecture**: Independent microservices with shared utilities
- **Framework**: MangoJS for dependency injection, routing, and middleware
- **Package Manager**: pnpm workspaces for efficient dependency management
- **Language**: TypeScript with strict mode enabled

## Technology Stack

- **Node.js** (>=18.0.0)
- **pnpm** (>=8.0.0)
- **TypeScript** (5.x)
- **MangoJS** (@giusmento/mangojs-core)

## Project Structure

```
pulcherbook-be/
├── services/              # Microservice applications
├── packages/
│   └── shared/           # Shared utilities, types, and constants
├── pnpm-workspace.yaml   # Workspace configuration
├── package.json          # Root package.json with workspace scripts
├── tsconfig.json         # Base TypeScript configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

Install pnpm if you haven't:

```bash
npm install -g pnpm
```

### Installation

Clone the repository and install dependencies:

```bash
# Install all dependencies across the monorepo
pnpm install
```

### Environment Setup

Copy the environment template:

```bash
cp .env.example .env
```

Edit `.env` and configure your service ports and credentials.

## Development

### Run All Services

Run all services in development mode with hot reload:

```bash
pnpm dev
```

### Run Specific Service

Run a specific service:

```bash
pnpm --filter @pulcherbook/service-name dev
```

### Build All Services

Build all services:

```bash
pnpm build
```

### Build Specific Service

Build a specific service:

```bash
pnpm --filter @pulcherbook/service-name build
```

## Adding a New Microservice

1. Create a new directory under `services/`:

```bash
mkdir services/my-service
```

2. Initialize the service package:

```bash
cd services/my-service
pnpm init
```

3. Configure `package.json`:

```json
{
  "name": "@pulcherbook/my-service",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.ts"
  },
  "dependencies": {
    "@giusmento/mangojs-core": "workspace:*",
    "@pulcherbook/shared": "workspace:*"
  }
}
```

4. Create `tsconfig.json` extending base config:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

5. Create your service entry point in `src/index.ts`

## Available Scripts

| Command        | Description                            |
| -------------- | -------------------------------------- |
| `pnpm install` | Install all dependencies               |
| `pnpm dev`     | Run all services in development mode   |
| `pnpm build`   | Build all services                     |
| `pnpm test`    | Run tests across all packages          |
| `pnpm clean`   | Clean build artifacts and dependencies |
| `pnpm lint`    | Lint all packages                      |

### Workspace-Specific Commands

```bash
# Add dependency to specific service
pnpm --filter @pulcherbook/service-name add package-name

# Add dependency to all workspaces
pnpm add -w package-name

# Run script in specific service
pnpm --filter @pulcherbook/service-name <script-name>
```

## Architecture

### Microservices Pattern

Each service in `services/` is an independent microservice that:

- Owns its data and database
- Exposes REST APIs
- Can communicate with other services via HTTP
- Uses MangoJS for dependency injection and routing

### Shared Package

The `packages/shared` package contains:

- Common TypeScript types and interfaces
- Shared utility functions
- Constants used across services
- Inter-service communication contracts

### Port Allocation

Configure unique ports for each service in `.env`:

- Gateway: 3000
- IAM Service: 3001
- Other services: 3002+

## MangoJS Features

MangoJS provides:

- **Dependency Injection**: Clean, testable code architecture
- **Decorators**: Express-like routing with TypeScript decorators
- **Middleware**: Request/response pipeline
- **Configuration**: Environment-based configuration management

Refer to MangoJS documentation for detailed usage.

## Best Practices

1. **Service Independence**: Each service should be independently deployable
2. **Database Per Service**: Each service owns its data
3. **Shared Code**: Place reusable code in `packages/shared`
4. **TypeScript**: Use strict mode and proper typing
5. **Environment Variables**: Never commit `.env` files
6. **Decorators**: Enable `experimentalDecorators` in tsconfig

## Deployment

### Building for Production

```bash
pnpm build
```

### Running in Production

```bash
# Run specific service
cd services/service-name
node dist/index.js
```

## License

ISC
