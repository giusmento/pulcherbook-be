/*
 * REQUEST
 * @see
 *
 * REQUEST: GET /api/v1/shops
 * REQUEST: GET /api/v1/shops/:uid
 */

import { Types } from "@giusmento/mangojs-core";
import { ResponseBodyData } from "..";

// Get all shops
export type Params = { partnerUid: string };
export type RequestBody = {};
export type QueryParams = undefined;
export type ResponseBody = Types.v1.api.response.response<
  Array<ResponseBodyData>
>;

// Get single shop
export type ParamsSingle = { uid: string };
export type ResponseBodySingle =
  Types.v1.api.response.response<ResponseBodyData>;
