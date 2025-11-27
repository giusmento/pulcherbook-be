/**
 * TeamService entity type definitions
 * These types define the shape of TeamService data for API operations
 */

/**
 * Full TeamService entity with all fields
 */
export type TeamService = {
  uid: string;
  teamId: string;
  serviceId: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Fields required when creating a new team-service mapping
 */
export type TeamServicePost = Pick<TeamService, "teamId" | "serviceId">;

/**
 * Fields that can be updated on an existing team-service mapping
 */
export type TeamServicePut = Partial<TeamServicePost>;
