/**
 * Availability entity type definitions
 * These types define the shape of TeamMemberAvailability data for API operations
 */

/**
 * Full TeamMemberAvailability entity with all fields
 */
export type TeamMemberAvailability = {
  uid: string;
  team_member_id: string;
  is_recurring: boolean;
  day_of_week: number | null;
  specific_date: Date | null;
  start_time: string;
  end_time: string;
  created_at: Date;
  updated_at: Date;
};

/**
 * Fields required when creating a new availability
 */
export type AvailabilityPost = Pick<
  TeamMemberAvailability,
  | "team_member_id"
  | "is_recurring"
  | "day_of_week"
  | "specific_date"
  | "start_time"
  | "end_time"
>;

/**
 * Fields that can be updated on an existing availability (excluding team_member_id)
 */
export type AvailabilityPut = Partial<Omit<AvailabilityPost, "team_member_id">>;
