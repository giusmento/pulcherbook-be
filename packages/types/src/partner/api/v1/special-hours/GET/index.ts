/*
 * REQUEST
 * @see
 *
 * REQUEST: GET /api/v1/shops/:shop_uid/special-hours
 * REQUEST: GET /api/v1/shops/:shop_uid/special-hours?date=YYYY-MM-DD
 * REQUEST: GET /api/v1/shops/:shop_uid/special-hours/:uid
 */

import { Types } from "@giusmento/mangojs-core";
import { ResponseBodyData } from "..";

// Get all special hours for a shop
export type Params = { shop_uid: string };
export type RequestBody = {};
export type QueryParams = {
  date?: string; // Optional date filter in YYYY-MM-DD format
};
export type ResponseBody = Types.v1.api.response.response<
  Array<ResponseBodyData>
>;

// Get single special hours
export type ParamsSingle = { shop_uid: string; uid: string };
export type QueryParamsSingle = {};
export type ResponseBodySingle = Types.v1.api.response.response<ResponseBodyData>;
