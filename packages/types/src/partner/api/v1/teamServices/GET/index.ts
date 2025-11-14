/**
 * Get all team services or get team service by UID
 */
import type { Types } from "@giusmento/mangojs-core/";
import { ResponseBodyData } from "..";

/*
 * REQUEST
 * @see
 *
 * REQUEST: GET /api/v1/team-services
 * REQUEST: GET /api/v1/team-services/:uid
 */

// For GET / (all team services)
export type Params = undefined;

// For GET /:uid (single team service)
export type ParamsSingle = { uid: string };
export type RequestBody = {};

/**
 * RESPONSE
 *
 * @see
 */

// For GET / (all team services)
export type ResponseBody = Types.v1.api.response.response<
  Array<ResponseBodyData>
>;

// For GET /:uid (single team service)
export type ResponseBodySingle = Types.v1.api.response.response<ResponseBodyData>;
