/**
 * Appointment entity type definitions
 * These types define the shape of Appointment data for API operations
 */

/**
 * Full Appointment entity with all fields
 */
export type Appointment = {
  uid: string;
  customerUserId: string;
  teamMemberId: string;
  serviceId: string;
  appointmentDate: Date;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: string;
  notes: string | null;
  customerNotes: string | null;
  cancellationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Fields required when creating a new appointment
 */
export type AppointmentPost = Pick<
  Appointment,
  | "customerUserId"
  | "teamMemberId"
  | "serviceId"
  | "appointmentDate"
  | "startTime"
  | "durationMinutes"
  | "customerNotes"
>;

/**
 * Fields that can be updated on an existing appointment (excluding customerUserId, teamMemberId, and serviceId)
 */
export type AppointmentPut = Partial<
  Omit<AppointmentPost, "customerUserId" | "teamMemberId" | "serviceId">
>;
