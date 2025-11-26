import {
  INVERSITY_TYPES,
  Types,
  IPersistenceContext,
  databasemanager,
  ApplicationPreCheck,
  IDatabaseManagerFactory,
  persistanceContext,
  Containers,
  services,
} from "@giusmento/mangojs-core";
// Import service classes
import { PartnerServiceEntities } from "./db/models";
import { IAMClientService } from "./services/iam-client.service";
import { ContainerModule, Container } from "inversify";

const POSTGRES_HOST = process.env.DATABASE_HOST || "localhost";
const POSTGRES_PORT = Number(process.env.DATABASE_PORT) || 5432;
const POSTGRES_DB = process.env.DATABASE_DB || "";
const POSTGRES_USER = process.env.DATABASE_USER || "";
const POSTGRES_PASSWORD = process.env.DATABASE_PASSWORD || "";

const syncronize = false;

/**
 * Initialize the partner service container
 * This should be called AFTER database initialization
 */
console.log("[Partner Service] Initializing Inversify container...");

// Get global IoC container
//const containerRoot = Containers.getContainer();
const partnerContainer = Containers.createChild(
  services.iam_server.IAMContainerManager
).getContainer();

export const initializePartnerContainer = () => {
  /**
   * Bind Database and Persistence
   */
  partnerContainer
    .bind<IDatabaseManagerFactory>(INVERSITY_TYPES.DatabaseManagerFactory)
    .toConstantValue(
      new databasemanager.postgres.PostgresDBManagerFactory(
        {
          host: POSTGRES_HOST,
          port: POSTGRES_PORT,
          database: POSTGRES_DB,
          username: POSTGRES_USER,
          password: POSTGRES_PASSWORD,
        },
        PartnerServiceEntities,
        syncronize
      )
    );
  partnerContainer
    .bind<IPersistenceContext>(INVERSITY_TYPES.PersistenceContext)
    .to(persistanceContext.PostgresPersistenceContext);

  /**
   * Bind IAM Client Service
   */
  partnerContainer
    .bind<IAMClientService>(IAMClientService)
    .to(IAMClientService)
    .inSingletonScope();

  console.log("[Partner Service] Container initialized successfully");
};

export { partnerContainer };
