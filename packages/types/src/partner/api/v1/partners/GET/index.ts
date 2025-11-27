/**
 * Get all partners or get partner by UID
 */
import type { Types } from "@giusmento/mangojs-core/";
import { ResponseBodyData } from "..";

/*
 * REQUEST
 * @see
 *
 * REQUEST: GET /api/v1/partners
 * REQUEST: GET /api/v1/partners/:uid
 */

// For GET / (all partners)
export type Params = undefined;

// For GET /:uid (single partner)
export type ParamsSingle = { uid: string };

export type RequestBody = {};

/**
 * RESPONSE
 *
 * @see
 */

// For GET / (all partners)
export type ResponseBody = Types.v1.api.response.response<
  Array<ResponseBodyData>
>;

// For GET /:uid (single partner)
export type ResponseBodySingle = Types.v1.api.response.response<ResponseBodyData>;
