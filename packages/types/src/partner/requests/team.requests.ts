/**
 * Service layer request types for Team
 * Used internally by the service methods
 */

import type { TeamPost, TeamPut } from "../entities";

/**
 * Service layer: Create team request
 * Same as API TeamPost - can diverge if internal logic needs different fields
 */
export type CreateTeamRequest = TeamPost;

/**
 * Service layer: Update team request
 * Same as API TeamPut - can diverge if internal logic needs different fields
 */
export type UpdateTeamRequest = TeamPut;
