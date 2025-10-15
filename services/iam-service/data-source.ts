import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { services } from "@mangojs/core";

dotenv.config();

const entities = [
            services.iam_server.models.AdminUser,
            services.iam_server.models.PartnerUser,
            services.iam_server.models.Group
        ]

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST || "",
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  username: process.env.DATABASE_USER || "postgres",
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME || "postgres",
  ssl: {
    rejectUnauthorized: false,
  },
   extra: {
    max: 10, // Maximum pool size
    min: 2,  // Minimum pool size
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  entities,
  migrations: ["./migrations/**/*.ts"],
  synchronize: false,
  logging: true,
});