/*
 * REQUEST
 * @see
 *
 * REQUEST: DELETE /api/v1/team-members/:uid
 */

import { Types } from "@giusmento/mangojs-core";
export type Params = { partnerUid: string; uid: string };

export type RequestBody = {};

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<{
  message: string;
}>;
