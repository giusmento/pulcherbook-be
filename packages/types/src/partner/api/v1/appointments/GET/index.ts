/**
 * Get all appointments or get appointment by UID
 */
import type { Types } from "@giusmento/mangojs-core/";
import { ResponseBodyData } from "..";

/*
 * REQUEST
 * @see
 *
 * REQUEST: GET /api/v1/appointments
 * REQUEST: GET /api/v1/appointments/:uid
 */

// For GET / (all appointments)
export type Params = undefined;

// For GET /:uid (single appointment)
export type ParamsSingle = { uid: string };
export type RequestBody = {};

/**
 * RESPONSE
 *
 * @see
 */

// For GET / (all appointments)
export type ResponseBody = Types.v1.api.response.response<
  Array<ResponseBodyData>
>;

// For GET /:uid (single appointment)
export type ResponseBodySingle = Types.v1.api.response.response<ResponseBodyData>;
