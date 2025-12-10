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
  query: string;
  page?: number;
  limit?: number;
  location?: string;
};
export type ResponseBody = Types.v1.api.response.PaginatedResponse<SearchShop>;
