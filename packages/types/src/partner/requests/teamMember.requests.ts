/**
 * Service layer request types for Team
 * Used internally by the service methods
 */

import type { TeamMemberPost, TeamMemberPut } from "../entities";

/**
 * Service layer: Create team request
 * Same as API TeamPost - can diverge if internal logic needs different fields
 */
export type CreateTeamMemberRequest = TeamMemberPost;

/**
 * Service layer: Update team request
 * Same as API TeamPut - can diverge if internal logic needs different fields
 */
export type UpdateTeamMemberRequest = TeamMemberPut;
