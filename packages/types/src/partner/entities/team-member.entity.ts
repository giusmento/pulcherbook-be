/**
 * TeamMember entity type definitions
 * These types define the shape of TeamMember data for API operations
 */

/**
 * Full TeamMember entity with all fields
 */
export type TeamMember = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  teams: Array<{ uid: string; name: string }>;
  systemGroups: Array<{ uid: string; name: string }>;
  externalUid: string;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * TeamMember entity from Iam Service
 */
export type IAMTeamMember = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  externalUid: string;
  systemGroups: Array<{ uid: string; name: string }>;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * PartnerTeamMember entity from the Partner Service
 */
export type PartnerTeamMember = {
  uid: string;
  externalUid: string;
  teams: Array<{ uid: string; name: string }>;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Fields required when creating a new team member
 */
export type TeamMemberPost = Pick<
  TeamMember,
  "firstName" | "lastName" | "email" | "phone"
>;

/**
 * Fields that can be updated on an existing team member (excluding team_id and user_id)
 */
export type TeamMemberPut = Partial<
  Pick<TeamMemberPost, "firstName" | "lastName" | "phone">
>;

// manage group for users
export type TeamManageForUser = {
  add?: Array<string>;
  remove?: Array<string>;
  set?: Array<string>;
};
