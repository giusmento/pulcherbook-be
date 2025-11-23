/**
 * Team entity type definitions
 * These types define the shape of Team data for API operations
 */

/**
 * Full Team entity with all fields
 */
export type Team = {
  uid: string;
  name: string;
  description: string | null;
  tags: Array<string>;
  status: string;
  created_at: Date;
  updated_at: Date;
};

/**
 * Fields required when creating a new team
 */
export type TeamPost = Pick<Team, "name" | "description" | "tags">;

/**
 * Fields that can be updated on an existing team (excluding partner_id)
 */
export type TeamPut = Partial<Omit<TeamPost, "created_at" | "updated_at">>;
