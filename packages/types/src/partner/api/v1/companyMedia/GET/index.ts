/**
 * Get all company media or get company media by UID
 */
import type { Types } from "@giusmento/mangojs-core/";
import { ResponseBodyData } from "..";

/*
 * REQUEST
 * @see
 *
 * REQUEST: GET /api/v1/company-media
 * REQUEST: GET /api/v1/company-media/:uid
 */

// For GET / (all company media)
export type Params = undefined;

// For GET /:uid (single company media)
export type ParamsSingle = { uid: string };
export type RequestBody = {};

/**
 * RESPONSE
 *
 * @see
 */

// For GET / (all company media)
export type ResponseBody = Types.v1.api.response.response<
  Array<ResponseBodyData>
>;

// For GET /:uid (single company media)
export type ResponseBodySingle = Types.v1.api.response.response<ResponseBodyData>;
