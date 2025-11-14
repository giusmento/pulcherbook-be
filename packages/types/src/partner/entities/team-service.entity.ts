/**
 * TeamService entity type definitions
 * These types define the shape of TeamService data for API operations
 */

/**
 * Full TeamService entity with all fields
 */
export type TeamService = {
  uid: string;
  team_id: string;
  service_id: string;
  created_at: Date;
  updated_at: Date;
};

/**
 * Fields required when creating a new team-service mapping
 */
export type TeamServicePost = Pick<TeamService, "team_id" | "service_id">;

/**
 * Fields that can be updated on an existing team-service mapping
 */
export type TeamServicePut = Partial<TeamServicePost>;
