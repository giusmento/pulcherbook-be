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
  | "customerUserId"
  | "teamMemberId"
  | "serviceId"
  | "appointmentDate"
  | "startTime"
  | "endTime"
  | "durationMinutes"
  | "status"
  | "notes"
  | "customerNotes"
  | "cancellationReason"
  | "createdAt"
  | "updatedAt"
>;
