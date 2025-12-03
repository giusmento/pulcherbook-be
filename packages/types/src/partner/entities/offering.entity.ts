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
  partnerUId: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  shops: Shop[];
  teams: Team[];
  currency: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Fields required when creating a new offering
 */
export type OfferingPost = Pick<
  Offering,
  | "partnerUId"
  | "name"
  | "description"
  | "durationMinutes"
  | "price"
  | "currency"
> & {
  shops?: string[]; // Array of Shop UIDs
  teams?: string[]; // Array of Team UIDs
};

/**
 * Fields that can be updated on an existing offering (excluding partnerId)
 */
export type OfferingPut = Partial<Omit<OfferingPost, "partnerId">>;
