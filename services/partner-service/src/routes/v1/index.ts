import { PartnerController } from "./partners/partner.controller";
import { TeamController } from "./teams/team.controller";
import { TeamMemberController } from "./team-members/team-member.controller";
import { ServiceController } from "./services/service.controller";
import { TeamServiceController } from "./team-services/team-service.controller";
import { CompanyMediaController } from "./company-media/company-media.controller";
import { AppointmentController } from "./appointments/appointment.controller";
import { AvailabilityController } from "./availability/availability.controller";
import { CatalogController } from "./catalog/catalog.controller";
import { ShopController } from "./shops/shop.controller";
import { WorkingHoursController } from "./working-hours/working-hours.controller";
import { SpecialHoursController } from "./special-hours/special-hours.controller";

export const routes = [
  PartnerController,
  TeamController,
  TeamMemberController,
  ServiceController,
  TeamServiceController,
  CompanyMediaController,
  AppointmentController,
  AvailabilityController,
  CatalogController,
  ShopController,
  WorkingHoursController,
  SpecialHoursController,
];
