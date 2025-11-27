/**
 * CompanyMedia entity type definitions
 * These types define the shape of CompanyMedia data for API operations
 */

/**
 * Full CompanyMedia entity with all fields
 */
export type CompanyMedia = {
  uid: string;
  partnerId: string;
  url: string;
  type: string;
  displayOrder: number | null;
  altText: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Fields required when creating a new company media
 */
export type CompanyMediaPost = Pick<
  CompanyMedia,
  "partnerId" | "url" | "type" | "displayOrder" | "altText"
>;

/**
 * Fields that can be updated on an existing company media (excluding partnerId, url, and type)
 */
export type CompanyMediaPut = Partial<Omit<CompanyMediaPost, "partnerId" | "url" | "type">>;
