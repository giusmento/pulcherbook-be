import { group } from "console";
import { TeamMember } from "../../../entities";

export * as POST from "./POST";
export * as GET from "./GET";
export * as PUT from "./PUT";
export * as DELETE from "./DELETE";
export * as groups from "./groups";
export * as upcomingAppointments from "./upcomingAppointments";

export type ResponseBodyData = Pick<
  TeamMember,
  | "uid"
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "status"
  | "teams"
  | "systemGroups"
  | "external_uid"
  | "joined_at"
  | "created_at"
  | "updated_at"
>;
