export { Partner } from "./Partner";
export { Team, TeamStatus } from "./Team";
export { TeamMember } from "./TeamMember";
export { Service } from "./Service";
export { TeamService } from "./TeamService";
export { CompanyMedia, MediaType } from "./CompanyMedia";
export { Appointment, AppointmentStatus } from "./Appointment";
export { TeamMemberAvailability } from "./TeamMemberAvailability";
export { BusinessType, BusinessTypeStatus } from "./BusinessType";
export { Shop } from "./Shop";
export { ShopWorkingHours } from "./ShopWorkingHours";
export { ShopSpecialHours } from "./ShopSpecialHours";

import { Partner } from "./Partner";
import { Team } from "./Team";
import { TeamMember } from "./TeamMember";
import { Service } from "./Service";
import { TeamService } from "./TeamService";
import { CompanyMedia } from "./CompanyMedia";
import { Appointment } from "./Appointment";
import { TeamMemberAvailability } from "./TeamMemberAvailability";
import { BusinessType } from "./BusinessType";
import { Shop } from "./Shop";
import { ShopWorkingHours } from "./ShopWorkingHours";
import { ShopSpecialHours } from "./ShopSpecialHours";
export const PartnerServiceEntities = [
  BusinessType,
  Partner,
  Shop,
  ShopWorkingHours,
  ShopSpecialHours,
  Team,
  TeamMember,
  Service,
  TeamService,
  CompanyMedia,
  Appointment,
  TeamMemberAvailability,
];
