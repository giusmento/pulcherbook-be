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
  externalUid: string;
  companyName: string;
  taxCode: string;
  firstName: string;
  lastName: string;
  email: string;
  description?: string;
  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressCountry?: string;
  addressPostalCode?: string;
  phoneNumber?: string;
  website?: string;
  businessType: BusinessType; // Can be full object or just UID
  status: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Fields required when creating a new partner
 */
export type PartnerWithUserPost = {
  companyName: string;
  addressCity: string;
  addressStreet: string;
  addressPostalCode: string;
  addressState: string;
  addressCountry: string;
  businessType: string;
  taxCode: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
  };
};

/**
 * Fields required when creating a new partner
 */
export type PartnerPost = {
  externalUid: string;
  companyName: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
};

/**
 * Fields that can be updated on an existing partner (excluding externalUid)
 */
export type PartnerPut = Partial<
  Pick<
    Partner,
    | "companyName"
    | "taxCode"
    | "description"
    | "phoneNumber"
    | "addressStreet"
    | "addressCity"
    | "addressPostalCode"
    | "addressCountry"
    | "addressState"
  >
> & {
  businessType?: string;
};
