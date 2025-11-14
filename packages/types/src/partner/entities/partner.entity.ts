/**
 * Partner entity type definitions
 * These types define the shape of Partner data for API operations
 */

/**
 * Full Partner entity with all fields
 */
export type Partner = {
  uid: string;
  external_uid: string;
  company_name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
};

/**
 * Fields required when creating a new partner
 */
export type PartnerPost = Pick<
  Partner,
  | "external_uid"
  | "company_name"
  | "description"
  | "address"
  | "city"
  | "state"
  | "country"
  | "postal_code"
  | "latitude"
  | "longitude"
  | "phone"
  | "email"
  | "website"
>;

/**
 * Fields that can be updated on an existing partner (excluding external_uid)
 */
export type PartnerPut = Partial<Omit<PartnerPost, "external_uid">>;
