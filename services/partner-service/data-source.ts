import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import * as models from "./db/models";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
  synchronize: process.env.DATABASE_SYNC === "true",
  logging: process.env.DATABASE_LOGGING === "true",
  entities: [
    models.Partner,
    models.Team,
    models.TeamMember,
    models.Service,
    models.TeamService,
    models.CompanyMedia,
    models.Appointment,
    models.TeamMemberAvailability,
  ],
  migrations: ["migrations/**/*.ts"],
  subscribers: [],
});
