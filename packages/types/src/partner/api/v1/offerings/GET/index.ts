/**
 * Get all services or get service by UID
 */
import type { Types } from "@giusmento/mangojs-core/";
import { ResponseBodyData } from "..";

/*
 * REQUEST
 * @see
 *
 * REQUEST: GET /api/v1/services
 * REQUEST: GET /api/v1/services/:uid
 */

// For GET / (all services)
export type Params = { partnerUid: string };

// For GET /:uid (single service)
export type ParamsSingle = { uid: string };
export type RequestBody = {};

/**
 * RESPONSE
 *
 * @see
 */

// For GET / (all services)
export type ResponseBody = Types.v1.api.response.response<
  Array<ResponseBodyData>
>;

// For GET /:uid (single service)
export type ResponseBodySingle =
  Types.v1.api.response.response<ResponseBodyData>;
