import { Container } from "inversify";
import {
  INVERSITY_TYPES,
  Types,
  IPersistenceContext,
  databasemanager,
  ApplicationPreCheck,
  IDatabaseManagerFactory,
  persistanceContext,
} from "@giusmento/mangojs-core";
// Import service classes
import { PartnerService } from "./service/partner.service";
import { TeamService } from "./service/team.service";
import { TeamMemberService } from "./service/team-member.service";
import { ServiceService } from "./service/service.service";
import { TeamServiceService } from "./service/team-service.service";
import { CompanyMediaService } from "./service/company-media.service";
import { AppointmentService } from "./service/appointment.service";
import { AvailabilityService } from "./service/availability.service";

// Create IoC container
export const PartnerContainer = new Container({ defaultScope: "Singleton" });

/**
 * Initialize the partner service container
 * This should be called AFTER database initialization
 */
export const initializePartnerContainer = () => {
  console.log("[Partner Service] Initializing Inversify container...");

  // Bind Database Manager Factory - Using Dummy since we manage DB with TypeORM AppDataSource
  PartnerContainer.bind<IDatabaseManagerFactory>(
    INVERSITY_TYPES.DatabaseManagerFactory
  ).toConstantValue(new databasemanager.DummyDBManagerFactory("dummy-connection"));

  // Bind Persistence Context - Using Dummy since we manage persistence with TypeORM
  PartnerContainer.bind<IPersistenceContext>(
    INVERSITY_TYPES.PersistenceContext
  ).to(persistanceContext.DummyPersistenceContext);

  // Bind application pre-check
  PartnerContainer.bind<Types.IApplicationPreCheck>(
    INVERSITY_TYPES.ApplicationPreCheck
  )
    .to(ApplicationPreCheck)
    .inSingletonScope();

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
