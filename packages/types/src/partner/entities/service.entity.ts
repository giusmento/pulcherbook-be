/**
 * Service entity type definitions
 * These types define the shape of Service data for API operations
 */

/**
 * Full Service entity with all fields
 */
export type Service = {
  uid: string;
  partnerId: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  currency: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Fields required when creating a new service
 */
export type ServicePost = Pick<
  Service,
  "partnerId" | "name" | "description" | "durationMinutes" | "price" | "currency"
>;

/**
 * Fields that can be updated on an existing service (excluding partnerId)
 */
export type ServicePut = Partial<Omit<ServicePost, "partnerId">>;
