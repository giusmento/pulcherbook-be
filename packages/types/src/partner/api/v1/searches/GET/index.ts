/*
 * REQUEST
 * @see
 *
 * REQUEST: GET /api/v1/shops/search
 */

import { Types } from "@giusmento/mangojs-core";
import { SearchShop } from "packages/types/src/partner/entities";

// Get all shops
export type Params = undefined;
export type QueryParams = {
  query?: string;  // Free text search query
  page?: number;
  limit?: number;
  location?: string;
  // Bounding box search parameters (for map-based search)
  neLat?: number;  // Northeast latitude
  neLng?: number;  // Northeast longitude
  swLat?: number;  // Southwest latitude
  swLng?: number;  // Southwest longitude
  // Filter parameters
  service?: string;  // Service name or category
  businessType?: string;  // Business type filter (e.g., 'salon', 'barbershop')
  services?: string;  // Comma-separated list of service IDs or names
};
export type ResponseBody = Types.v1.api.response.PaginatedResponse<SearchShop>;
