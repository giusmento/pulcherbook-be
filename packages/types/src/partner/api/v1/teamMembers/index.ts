import { TeamMember } from "../../../entities";

export * as POST from "./POST";
export * as GET from "./GET";
export * as DELETE from "./DELETE";
export * as upcomingAppointments from "./upcomingAppointments";

export type ResponseBodyData = Pick<
  TeamMember,
  | "uid"
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "external_uid"
  | "joined_at"
  | "created_at"
  | "updated_at"
>;
