/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/team-members
 */

import { Types } from "@giusmento/mangojs-core";
import { TeamMemberPost } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = { partnerUid: string };

export type RequestBody = TeamMemberPost;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
