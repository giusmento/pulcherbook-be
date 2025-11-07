import * as models from "../../db/models";

export type Appointment = models.Appointment;
export type AppointmentPost = Pick<
  Appointment,
  | "customer_user_id"
  | "team_member_id"
  | "service_id"
  | "appointment_date"
  | "start_time"
  | "duration_minutes"
  | "customer_notes"
>;
export type AppointmentPut = Partial<
  Omit<AppointmentPost, "customer_user_id" | "team_member_id" | "service_id">
>;
