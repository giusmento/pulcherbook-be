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
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Fields required when creating a new team
 */
export type TeamPost = Pick<Team, "name" | "description" | "tags">;

/**
 * Fields that can be updated on an existing team (excluding partnerId)
 */
export type TeamPut = Partial<Omit<TeamPost, "createdAt" | "updatedAt">>;
