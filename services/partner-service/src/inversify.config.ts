import {
  INVERSITY_TYPES,
  Types,
  IPersistenceContext,
  databasemanager,
  ApplicationPreCheck,
  IDatabaseManagerFactory,
  persistanceContext,
  Containers,
} from "@giusmento/mangojs-core";
// Import service classes
import { PartnerService } from "./services/partner.service";
import { TeamService } from "./services/team.service";
import { TeamMemberService } from "./services/team-member.service";
import { ServiceService } from "./services/service.service";
import { TeamServiceService } from "./services/team-service.service";
import { CompanyMediaService } from "./services/company-media.service";
import { AppointmentService } from "./services/appointment.service";
import { AvailabilityService } from "./services/availability.service";

/**
 * Initialize the partner service container
 * This should be called AFTER database initialization
 */
export const initializePartnerContainer = async () => {
  console.log("[Partner Service] Initializing Inversify container...");

  // Get global IoC container
  const PartnerContainer = Containers.getContainer();
  // Bind Database Manager Factory - Using Dummy since we manage DB with TypeORM AppDataSource
  // NOTE: Future upgrade path: Replace with PostgresDBManagerFactory when fully migrating to mangojs persistence
  await PartnerContainer.unbind(INVERSITY_TYPES.DatabaseManagerFactory);
  PartnerContainer.bind<IDatabaseManagerFactory>(
    INVERSITY_TYPES.DatabaseManagerFactory
  ).toConstantValue(new databasemanager.DummyDBManagerFactory("partner-db"));

  // Bind Persistence Context - Using Dummy since we manage persistence with TypeORM
  // NOTE: Services use AppDataSource.transaction() directly for proper transaction handling
  PartnerContainer.bind<IPersistenceContext>(
    INVERSITY_TYPES.PersistenceContext
  ).to(persistanceContext.DummyPersistenceContext);

  // Bind application pre-check

  // TODO: Bind authentication validator when IAM integration is ready
  // PartnerContainer.bind<Auth.IAuthValidator>(Auth.RemoteAuthValidator)
  //   .toDynamicValue(() => {
  //     return new Auth.RemoteAuthValidator(process.env.IAM_SERVICE_URL);
  //   })
  //   .inSingletonScope();

  // Bind all service classes
  PartnerContainer.bind<PartnerService>(PartnerService)
    .to(PartnerService)
    .inSingletonScope();

  PartnerContainer.bind<TeamService>(TeamService)
    .to(TeamService)
    .inSingletonScope();

  PartnerContainer.bind<TeamMemberService>(TeamMemberService)
    .to(TeamMemberService)
    .inSingletonScope();

  PartnerContainer.bind<ServiceService>(ServiceService)
    .to(ServiceService)
    .inSingletonScope();

  PartnerContainer.bind<TeamServiceService>(TeamServiceService)
    .to(TeamServiceService)
    .inSingletonScope();

  PartnerContainer.bind<CompanyMediaService>(CompanyMediaService)
    .to(CompanyMediaService)
    .inSingletonScope();

  PartnerContainer.bind<AppointmentService>(AppointmentService)
    .to(AppointmentService)
    .inSingletonScope();

  PartnerContainer.bind<AvailabilityService>(AvailabilityService)
    .to(AvailabilityService)
    .inSingletonScope();

  console.log("[Partner Service] Container initialized successfully");
};
