/**
 * Availability entity type definitions
 * These types define the shape of TeamMemberAvailability data for API operations
 */

/**
 * Full TeamMemberAvailability entity with all fields
 */
export type TeamMemberAvailability = {
  uid: string;
  teamMemberId: string;
  isRecurring: boolean;
  dayOfWeek: number | null;
  specificDate: Date | null;
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Fields required when creating a new availability
 */
export type AvailabilityPost = Pick<
  TeamMemberAvailability,
  | "teamMemberId"
  | "isRecurring"
  | "dayOfWeek"
  | "specificDate"
  | "startTime"
  | "endTime"
>;

/**
 * Fields that can be updated on an existing availability (excluding teamMemberId)
 */
export type AvailabilityPut = Partial<Omit<AvailabilityPost, "teamMemberId">>;
