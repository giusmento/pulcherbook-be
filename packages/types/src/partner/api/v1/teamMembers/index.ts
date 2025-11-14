import { TeamMember } from "../../../entities";

export * as POST from "./POST";
export * as GET from "./GET";
export * as DELETE from "./DELETE";
export * as upcomingAppointments from "./upcomingAppointments";

export type ResponseBodyData = Pick<
  TeamMember,
  | "uid"
  | "team_id"
  | "user_id"
  | "role"
  | "joined_at"
  | "created_at"
  | "updated_at"
>;
