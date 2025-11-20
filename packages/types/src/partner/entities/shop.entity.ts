/**
 * Shop entity type definitions
 * These types define the shape of Shop data for API operations
 */

import { BusinessTypeShort } from "./common";

/**
 * Full Shop entity with all fields
 * This is the source of truth for the shop structure
 */
export type Shop = {
  uid: string;
  partner_uid: string;
  shop_name: string;
  business_type: BusinessTypeShort;
  description: string;
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
  instagram: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

/**
 * API POST request body - Fields required when creating a new shop
 * Derived from Shop entity
 */
export type ShopPost = Pick<
  Shop,
  | "partner_uid"
  | "shop_name"
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
  | "instagram"
>;

/**
 * API PUT request body - Fields that can be updated on an existing shop
 * Derived from Shop entity (excluding partner_uid, can add business_type and status)
 */
export type ShopPut = Partial<Omit<ShopPost, "partner_uid">> & {
  business_type?: string;
  status?: string;
};
