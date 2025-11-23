/**
 * Get all teams or get team by UID
 */
import type { Types } from "@giusmento/mangojs-core/";
import { ResponseBodyData } from "..";

/*
 * REQUEST
 * @see
 *
 * REQUEST: GET /api/v1/partners/:partner_uid/teams
 * REQUEST: GET /api/v1/partners/:partner_uid/teams/:uid
 */

// For GET / (all teams)
export type Params = { partner_uid: string };

// For GET /:uid (single team)
export type ParamsSingle = { partner_uid: string; uid: string };
export type RequestBody = {};

/**
 * RESPONSE
 *
 * @see
 */

// For GET / (all teams)
export type ResponseBody = Types.v1.api.response.response<
  Array<ResponseBodyData>
>;

// For GET /:uid (single team)
export type ResponseBodySingle =
  Types.v1.api.response.response<ResponseBodyData>;
