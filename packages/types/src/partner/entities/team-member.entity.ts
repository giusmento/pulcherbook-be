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
  external_uid: string;
  joined_at: Date;
  created_at: Date;
  updated_at: Date;
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
  Omit<
    TeamMemberPost,
    "uid" | "external_uid" | "created_at" | "updated_at" | "joined_at"
  >
>;
