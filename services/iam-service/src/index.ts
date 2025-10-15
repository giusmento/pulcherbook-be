// IMPORTANT: Load environment variables FIRST
import dotenv from "dotenv";
dotenv.config();

import "reflect-metadata";
import { ServerBuilder } from "@mangojs/core";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import swaggerJSDoc from "swagger-jsdoc";
import swaggerJson from "../docs/swagger.api.json";

///////////////////
// VARIABLES

// set microservice port
const PORT = Number(process.env.PORT) || 3001;

// set express cors options
let corsOptions = {
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:3000",
  ],
  credentials: true,
};

// cors
const corsOriginFunction = function (origin, callback) {
  // allow requests with no origin
  // (like mobile apps or curl requests)
  if (!origin) return callback(null, true);
  if (corsOptions.allowedOrigins.indexOf(origin) === -1) {
    var msg =
      "The CORS policy for this site does not " +
      "allow access from the specified Origin.";
    return callback(new Error(msg), false);
  }
  return callback(null, true);
};

///////////////////
// SETUP AND START SERVER
(async () => {
  try {
    console.log("[IAM Service] Starting initialization...");

    // Step 1: Configure container BEFORE loading services
    //console.log("[IAM Service] Step 1: Configuring container...");
    //await import("./inversify.config");

    // Step 2: NOW import services after container is configured
    console.log("[IAM Service] Step 1: Loading services...");
    const { services } = await import("@mangojs/core");

    console.log("[IAM Service] Step 2: Building server...");

    ///////////////////
    // PREPARE SERVER
    const applicationServer = new ServerBuilder()
      .setName("iam-service")
      .setPort(PORT)
      .setRoutes(services.iam_server.routes.routes)
      .setUserAuthentication(true)
      .enableSwagger(true)
      .setSwaggerSpec(swaggerJSDoc(swaggerJson))
      .expressUse(helmet())
      .expressUse(
        cors({
          origin: corsOriginFunction,
          credentials: corsOptions.credentials,
        })
      )
      .expressUse(cookieParser())
      .build(); // build

    ///////////////////
    // START SERVER
    console.log("[IAM Service] Step 3: Starting server...");
    const appExpress = await applicationServer;
    appExpress.run();
  } catch (err) {
    console.log({ err }, "ERROR STARTING SERVER");
  }
})();
