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
  partnerUid: string;
  shopName: string;
  businessType: BusinessTypeShort;
  description: string;
  addressStreet: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressCountry: string | null;
  addressPostalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  phoneNumber: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * API POST request body - Fields required when creating a new shop
 * Derived from Shop entity
 */
export type ShopPost = Pick<
  Shop,
  | "shopName"
  | "partnerUid"
  | "description"
  | "addressStreet"
  | "addressCity"
  | "addressState"
  | "addressCountry"
  | "addressPostalCode"
  | "latitude"
  | "longitude"
  | "phoneNumber"
  | "email"
  | "website"
  | "instagram"
>;

/**
 * API PUT request body - Fields that can be updated on an existing shop
 * Derived from Shop entity (excluding partnerUid, can add businessType and status)
 */
export type ShopPut = Partial<Omit<ShopPost, "partnerUid">> & {
  businessType?: string;
  status?: string;
};
