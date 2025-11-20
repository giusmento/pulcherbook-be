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
export type Params = { shop_uid: string };
export type RequestBody = {};
export type ResponseBody = Types.v1.api.response.response<
  Array<ResponseBodyData>
>;

// Get single working hours
export type ParamsSingle = { shop_uid: string; uid: string };
export type ResponseBodySingle = Types.v1.api.response.response<ResponseBodyData>;
