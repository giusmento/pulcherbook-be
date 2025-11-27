import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import * as models from "./src/db/models";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  schema: "partner",
  migrationsTableName: "migration-partner",
  ssl:
    process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
  synchronize: process.env.DATABASE_SYNC === "true",
  logging: process.env.DATABASE_LOGGING === "true",
  entities: models.PartnerServiceEntities,
  migrations: ["migrations/**/*.ts"],
  subscribers: [],
});
