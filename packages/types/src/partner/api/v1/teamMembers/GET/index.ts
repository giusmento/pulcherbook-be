/**
 * Get all team members or get team member by UID
 */
import type { Types } from "@giusmento/mangojs-core/";
import { ResponseBodyData } from "..";

/*
 * REQUEST
 * @see
 *
 * REQUEST: GET /api/v1/team-members
 * REQUEST: GET /api/v1/team-members/:uid
 */

// For GET / (all team members)
export type Params = undefined;

// For GET /:uid (single team member)
export type ParamsSingle = { uid: string };
export type RequestBody = {};

/**
 * RESPONSE
 *
 * @see
 */

// For GET / (all team members)
export type ResponseBody = Types.v1.api.response.response<
  Array<ResponseBodyData>
>;

// For GET /:uid (single team member)
export type ResponseBodySingle = Types.v1.api.response.response<ResponseBodyData>;
