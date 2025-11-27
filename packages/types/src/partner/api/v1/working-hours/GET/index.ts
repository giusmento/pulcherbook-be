/*
 * REQUEST
 * @see
 *
 * REQUEST: GET /api/v1/shops/:shop_uid/working-hours
 * REQUEST: GET /api/v1/shops/:shop_uid/working-hours/:uid
 */

import { Types } from "@giusmento/mangojs-core";
import { ResponseBodyData } from "..";

// Get all working hours for a shop
export type Params = { partnerUid: string; shopUid: string };
export type RequestBody = {};
export type QueryParams = {};
export type ResponseBody = Types.v1.api.response.response<
  Array<ResponseBodyData>
>;
