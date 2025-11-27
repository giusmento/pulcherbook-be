/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/adminUser
 */

import { Types } from "@giusmento/mangojs-core";
import { TeamManageForUser } from "../../../../../entities/team-member.entity";

export type Params = { partnerUid: string; uid: string };

export type RequestBody = TeamManageForUser;
/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<{
  data: {};
  ok: boolean;
}>;
