/**
 * Partner entity type definitions
 * These types define the shape of Partner data for API operations
 */

import { BusinessType } from "./common";

/**
 * Full Partner entity with all fields
 */
export type Partner = {
  uid: string;
  external_uid: string;
  company_name: string;
  tax_code: string;
  first_name: string;
  last_name: string;
  email: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  phone?: string;
  website?: string;
  business_type: BusinessType;
  status: string;
  created_at: Date;
  updated_at: Date;
};

/**
 * Fields required when creating a new partner
 */
export type PartnerPost = Pick<
  Partner,
  | "company_name"
  | "tax_code"
  | "first_name"
  | "last_name"
  | "email"
  | "business_type"
  | "address"
  | "city"
  | "state"
  | "country"
  | "postal_code"
  | "phone"
  | "website"
  | "description"
> & {
  password: string;
};

/**
 * Fields that can be updated on an existing partner (excluding external_uid)
 */
export type PartnerPut = Partial<Omit<PartnerPost, "external_uid" | "uid">>;
