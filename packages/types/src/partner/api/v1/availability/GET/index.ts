/**
 * Get all availability or get availability by UID
 */
import type { Types } from "@giusmento/mangojs-core/";
import { ResponseBodyData } from "..";

/*
 * REQUEST
 * @see
 *
 * REQUEST: GET /api/v1/availability
 * REQUEST: GET /api/v1/availability/:uid
 */

// For GET / (all availability)
export type Params = undefined;

// For GET /:uid (single availability)
export type ParamsSingle = { uid: string };
export type RequestBody = {};

/**
 * RESPONSE
 *
 * @see
 */

// For GET / (all availability)
export type ResponseBody = Types.v1.api.response.response<
  Array<ResponseBodyData>
>;

// For GET /:uid (single availability)
export type ResponseBodySingle = Types.v1.api.response.response<ResponseBodyData>;
