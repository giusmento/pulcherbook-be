/**
 * TeamMember entity type definitions
 * These types define the shape of TeamMember data for API operations
 */

/**
 * Full TeamMember entity with all fields
 */
export type TeamMember = {
  uid: string;
  team_id: string;
  user_id: string;
  role: string | null;
  joined_at: Date;
  created_at: Date;
  updated_at: Date;
};

/**
 * Fields required when creating a new team member
 */
export type TeamMemberPost = Pick<TeamMember, "team_id" | "user_id" | "role">;

/**
 * Fields that can be updated on an existing team member (excluding team_id and user_id)
 */
export type TeamMemberPut = Partial<Omit<TeamMemberPost, "team_id" | "user_id">>;
