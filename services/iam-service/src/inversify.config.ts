// DO NOT WORK - USING DEFAULT CONTAINER FROM CORE
// can't rebind services. Not sure where it loads components before this file
//import { Containers } from "@giusmento/mangojs-core";
//import { IPersistenceContext } from "@giusmento/mangojs-core";
//import { IDatabaseManagerFactory } from "@giusmento/mangojs-core";
//
//import { services } from "@giusmento/mangojs-core";

//
//// Import our custom service
//import { AdminUserService } from "./services/adminUser.service";
//
//const POSTGRES_PASSWORD = process.env.DATABASE_PASSWORD || "";
//const POSTGRES_USER = process.env.DATABASE_USER || "";
//const POSTGRES_DB = process.env.DATABASE_DB || "";
//

import { INVERSITY_TYPES, Providers, services } from "@giusmento/mangojs-core";
import fs from "fs";

/**
 * Helper function to read Docker secrets from file
 * Docker mounts secrets as files, not environment variables
 */
const readDockerSecret = (envVarName: string): string => {
  const secretPath = process.env[envVarName];

  if (!secretPath) {
    return "";
  }

  // Check if it's a file path (Docker secret)
  if (secretPath.startsWith("/run/secrets/")) {
    try {
      return fs.readFileSync(secretPath, "utf8").trim();
    } catch (error) {
      console.error(`Failed to read secret from ${secretPath}:`, error);
      return "";
    }
  }

  // Otherwise, it's a direct value (for local development)
  return secretPath;
};

export const setIAMContainer = () => {
  /**
   * BIND Services
   * */

  // Bind Email Service - Brevo
  console.log("[IAM Service] Binding EmailService...");
  //get env variables
  const brevoApikey = readDockerSecret("BREVO_APIKEY_FILE");
  const emailFromAddress = process.env.EMAIL_SENDER_ADDRESS || "";
  const appName = process.env.APP_NAME;

  console.log(`${brevoApikey}, ${emailFromAddress}, ${appName}`);

  services.iam_server.IAMDefaultContainer.unbind(INVERSITY_TYPES.EmailService);
  services.iam_server.IAMDefaultContainer.bind<Providers.email.IEmailService>(
    INVERSITY_TYPES.EmailService
  ).toConstantValue(
    new Providers.email.EmailServiceBrevo(
      emailFromAddress,
      appName,
      brevoApikey
    )
  );
};

// Also bind with string identifier for backward compatibility

//
//console.log("[IAM Service] Configuring Inversify Container...");
//console.log("[IAM Service] Current bindings in container:");
//console.log("  - DatabaseManagerFactory bound?",container.isBound(INVERSITY_TYPES.DatabaseManagerFactory);
//);
//console.log(""  - PersistenceContext bound?", container.isBound(INVERSITY_TYPES.PersistenceContext);
//);
//console.log("  - LoggerFactory bound?", container.isBound(INVERSITY_TYPES.LoggerFactory);
//);
//console.log("  - AuthorizationContext bound?",container.isBound(INVERSITY_TYPES.AuthorizationContext);
//);
//
///**
// * Bind Persistance Context - PostgresDB
// */
////if (container.isBound(INVERSITY_TYPES.PersistenceContext)) {
////  console.log("[IAM Service] Unbinding existing PersistenceContext");
////  container.unbind(INVERSITY_TYPES.PersistenceContext);
////}
////
////console.log("[IAM Service] Binding PostgresPersistenceContext");
////container
////  .bind<IPersistenceContext>(INVERSITY_TYPES.PersistenceContext)
////  .to(persistanceContext.PostgresPersistenceContext);
//
///**
// * Bind Database connector - Supabase
// * Configure via environment variables
// */
////if (container.isBound(INVERSITY_TYPES.DatabaseManagerFactory)) {
////  console.log("[IAM Service] Unbinding existing DatabaseManagerFactory");
////  container.unbind(INVERSITY_TYPES.DatabaseManagerFactory);
////}
//
//// ERROR ON REBIND
////console.log("[IAM Service] Binding PostgresDBManagerFactory for Supabase");
////container
////  .bind<IDatabaseManagerFactory>(INVERSITY_TYPES.DatabaseManagerFactory)
////  .toConstantValue(
////    new databasemanager.postgres.PostgresDBManagerFactory(
////      {
////        username: POSTGRES_USER,
////        password: POSTGRES_PASSWORD,
////        database: POSTGRES_DB,
////        host: process.env.DATABASE_HOST || "localhost",
////        port: Number(process.env.DATABASE_PORT) || 5432,
////      },
////      [
////        services.iam_server.models.AdminUser,
////        services.iam_server.models.PartnerUser,
////        services.iam_server.models.Group,
////      ]
////    )
////  );
//
///**
// * Bind Logger Service
// */
//if (container.isBound(INVERSITY_TYPES.LoggerFactory)) {
//  console.log("[IAM Service] Unbinding existing LoggerFactory");
//  container.unbind(INVERSITY_TYPES.LoggerFactory);
//}
//
//console.log("[IAM Service] Binding LoggerPino");
//container
//  .bind<Loggers.ILoggerFactory>(INVERSITY_TYPES.LoggerFactory)
//  .toConstantValue(
//    new Loggers.LoggerPino("iam-service", process.env.LOG_LEVEL || "debug")
//  );
//
//export { container as DefaultContainer };
//
