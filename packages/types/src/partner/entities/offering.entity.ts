/**
 * Service entity type definitions
 * These types define the shape of Service data for API operations
 */

import { Shop } from "./shop.entity";
import { Team } from "./team.entity";

/**
 * Full Service entity with all fields
 */
export type Offering = {
  uid: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  currency: string;
  shops: { uid: string; name: string }[];
  teams: { uid: string; name: string }[];
  category: { uid: string; name: string } | null;
  bookingAlgorithm: { name: string };
  isBookedOnline: boolean;
  isRequiredConfirmation: boolean;
  isRequiredConsulting: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Fields required when creating a new offering
 */
export type OfferingPost = Pick<
  Offering,
  | "name"
  | "description"
  | "durationMinutes"
  | "price"
  | "currency"
  | "shops"
  | "teams"
  | "category"
  | "bookingAlgorithm"
  | "isBookedOnline"
  | "isRequiredConfirmation"
  | "isRequiredConsulting"
>;

/**
 * Fields that can be updated on an existing offering (excluding partnerId)
 */
export type OfferingPut = Partial<OfferingPost>;
