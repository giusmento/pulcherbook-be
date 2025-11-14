import { Appointment } from "../../../entities";

export * as POST from "./POST";
export * as GET from "./GET";
export * as PUT from "./PUT";
export * as DELETE from "./DELETE";
export * as status from "./status";
export * as checkAvailability from "./checkAvailability";

export type ResponseBodyData = Pick<
  Appointment,
  | "uid"
  | "customer_user_id"
  | "team_member_id"
  | "service_id"
  | "appointment_date"
  | "start_time"
  | "end_time"
  | "duration_minutes"
  | "status"
  | "notes"
  | "customer_notes"
  | "cancellation_reason"
  | "created_at"
  | "updated_at"
>;
