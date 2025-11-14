/**
 * Service entity type definitions
 * These types define the shape of Service data for API operations
 */

/**
 * Full Service entity with all fields
 */
export type Service = {
  uid: string;
  partner_id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  currency: string;
  status: string;
  created_at: Date;
  updated_at: Date;
};

/**
 * Fields required when creating a new service
 */
export type ServicePost = Pick<
  Service,
  "partner_id" | "name" | "description" | "duration_minutes" | "price" | "currency"
>;

/**
 * Fields that can be updated on an existing service (excluding partner_id)
 */
export type ServicePut = Partial<Omit<ServicePost, "partner_id">>;
