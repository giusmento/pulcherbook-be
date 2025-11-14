/**
 * Appointment entity type definitions
 * These types define the shape of Appointment data for API operations
 */

/**
 * Full Appointment entity with all fields
 */
export type Appointment = {
  uid: string;
  customer_user_id: string;
  team_member_id: string;
  service_id: string;
  appointment_date: Date;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: string;
  notes: string | null;
  customer_notes: string | null;
  cancellation_reason: string | null;
  created_at: Date;
  updated_at: Date;
};

/**
 * Fields required when creating a new appointment
 */
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

/**
 * Fields that can be updated on an existing appointment (excluding customer_user_id, team_member_id, and service_id)
 */
export type AppointmentPut = Partial<
  Omit<AppointmentPost, "customer_user_id" | "team_member_id" | "service_id">
>;
