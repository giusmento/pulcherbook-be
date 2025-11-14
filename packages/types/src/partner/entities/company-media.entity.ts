/**
 * CompanyMedia entity type definitions
 * These types define the shape of CompanyMedia data for API operations
 */

/**
 * Full CompanyMedia entity with all fields
 */
export type CompanyMedia = {
  uid: string;
  partner_id: string;
  url: string;
  type: string;
  display_order: number | null;
  alt_text: string | null;
  created_at: Date;
  updated_at: Date;
};

/**
 * Fields required when creating a new company media
 */
export type CompanyMediaPost = Pick<
  CompanyMedia,
  "partner_id" | "url" | "type" | "display_order" | "alt_text"
>;

/**
 * Fields that can be updated on an existing company media (excluding partner_id, url, and type)
 */
export type CompanyMediaPut = Partial<Omit<CompanyMediaPost, "partner_id" | "url" | "type">>;
