/**
 * OfferingCategory entity type definitions
 * These types define the shape of OfferingCategory data for API operations
 */

/**
 * Full OfferingCategory entity with all fields
 */
export type OfferingCategory = {
  uid: string;
  type: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

/**
 * Short version of OfferingCategory for catalog/list views
 */
export type OfferingCategoryShort = Pick<
  OfferingCategory,
  "uid" | "type" | "name" | "description"
>;
