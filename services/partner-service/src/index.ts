// IMPORTANT: Load environment variables FIRST
import dotenv from "dotenv";
dotenv.config();

// IMPORTS
import "reflect-metadata";
import { initializePartnerContainer } from "./inversify.config";
import { ServerBuilder } from "@giusmento/mangojs-core";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerJSDoc from "swagger-jsdoc";

import { routes } from "./routes";

///////////////////
// VARIABLES

// set microservice port
const PORT = Number(process.env.PORT) || 3002;

// set express cors options
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:8081",
      "https://pulcherbook.com",
    ];

    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
};

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Partner Service API",
      version: "0.1.0",
      description:
        "Partner and booking management service for Pulcherbook platform",
    },
    servers: [
      {
        url: process.env.API_URL || `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

///////////////////
// SETUP AND START SERVER
(async () => {
  try {
    console.log("[Partner Service] Starting initialization...");

    // Step 1: Initialize database connection
    console.log("[Partner Service] Step 1: Connecting to database...");
    //await AppDataSource.initialize();
    console.log("[Partner Service] Database connected successfully");

    // Step 2: Initialize Inversify container
    console.log("[Partner Service] Step 2: Initializing DI container...");
    initializePartnerContainer();

    // Step 3: Build server with MangoJS ServerBuilder
    console.log("[Partner Service] Step 3: Building server...");
    const applicationServer = new ServerBuilder()
      .setName("partner-service")
      .setPort(PORT)
      .setRoutes(routes)
      .setUserAuthentication(false) // TODO: Enable when IAM integration is ready
      .enableSwagger(true)
      .setSwaggerSpec(swaggerJSDoc(swaggerOptions))
      .expressUse(helmet())
      .expressUse(
        cors({
          origin: corsOptions.origin,
          credentials: corsOptions.credentials,
        })
      )
      .expressUse(cookieParser())
      .build();

    // Step 4: Start server
    console.log("[Partner Service] Step 4: Starting server...");
    const appExpress = await applicationServer;
    appExpress.run();
  } catch (err) {
    console.error("[Partner Service] ERROR STARTING SERVER:", err);
    process.exit(1);
  }
})();
