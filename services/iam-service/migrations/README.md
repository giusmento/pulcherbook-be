# IAM Service Database Migrations

This directory contains TypeORM migrations for the IAM Service database schema with Supabase.

## Prerequisites

- Node.js installed
- TypeORM CLI installed globally or locally
- Supabase project created with database credentials
- Environment variables configured

## Setup

### 1. Install TypeORM CLI

```bash
# Global installation
npm install -g typeorm

# Or use npx (no installation needed)
npx typeorm-ts-node-commonjs
```

### 2. Configure Database Connection

Create a `ormconfig.json` or `data-source.ts` file in the service root (`services/iam-service/`):

```
{
  "type": "postgres",
  "host": "your-supabase-host.supabase.co",
  "port": 5432,
  "username": "postgres",
  "password": "your-password",
  "database": "postgres",
  "ssl": {
    "rejectUnauthorized": false
  },
  "entities": ["node_modules/@mangojs/core/src/services/iam_server/src/db/models/*.entity.ts"],
  "migrations": ["src/db/migrations/*.ts"],
  "migrationsTableName": "migrations",
  "synchronize": false,
  "logging": true
}
```

Option B: data-source.ts (TypeORM 0.3+)

```typescript
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { services } from "@mangojs/core";

dotenv.config();

const entities = [
  services.iam_server.models.AdminUser,
  services.iam_server.models.PartnerUser,
  services.iam_server.models.Group,
];

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "your-project.supabase.co",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "postgres",
  ssl: {
    rejectUnauthorized: false,
  },
  // Add connection pool settings
  extra: {
    max: 10, // Maximum pool size
    min: 2, // Minimum pool size
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  entities,
  migrations: ["./migrations/**/*.ts"],
  synchronize: false,
  logging: true,
});
```

Add to your `.env` file:

```env
# Supabase Database Connection
DB_HOST=your-project.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-supabase-password
DB_NAME=postgres

# For production, use connection pooling
# DB_PORT=6543
```

**Get these values from:** Supabase Dashboard � Settings � Database � Connection string

## Migration Commands

### Generate Migration from Entities

Automatically generate migration based on entity changes:

```bash
cd services/iam-service

# TypeORM 0.3+
npx typeorm-ts-node-commonjs migration:generate ./migrations/InitialSchema -d data-source.ts
```

### Create Empty Migration

Create a new empty migration file:

```bash
npx typeorm-ts-node-commonjs migration:create ./migrations/YourMigrationName
```

### Run Migrations

Apply pending migrations to the database:

```bash
npx typeorm-ts-node-commonjs migration:run -d data-source.ts
```

### Revert Migration

Revert the last executed migration:

```bash
npx typeorm-ts-node-commonjs migration:revert -d data-source.ts
```

### Show Migration Status

Display which migrations have been run:

```bash
npx typeorm-ts-node-commonjs migration:show -d data-source.ts
```

## Additional Resources

- [TypeORM Migrations Documentation](https://typeorm.io/migrations)
- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [IAM Service Data Model](../docs/conceptual-model.db.mmd)
- [IAM Service API Documentation](../docs/swagger.api.json)
