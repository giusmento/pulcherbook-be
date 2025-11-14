/**
 * Team entity type definitions
 * These types define the shape of Team data for API operations
 */

/**
 * Full Team entity with all fields
 */
export type Team = {
  uid: string;
  partner_id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
};

/**
 * Fields required when creating a new team
 */
export type TeamPost = Pick<Team, "partner_id" | "name" | "description">;

/**
 * Fields that can be updated on an existing team (excluding partner_id)
 */
export type TeamPut = Partial<Omit<TeamPost, "partner_id">>;
