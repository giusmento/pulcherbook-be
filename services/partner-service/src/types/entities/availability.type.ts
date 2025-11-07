import * as models from "../../db/models";

export type Availability = models.TeamMemberAvailability;
export type AvailabilityPost = Pick<
  Availability,
  | "team_member_id"
  | "is_recurring"
  | "day_of_week"
  | "specific_date"
  | "start_time"
  | "end_time"
>;
export type AvailabilityPut = Partial<Omit<AvailabilityPost, "team_member_id">>;
