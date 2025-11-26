/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/team-members
 */

import { Types } from "@giusmento/mangojs-core";
import { ResponseBodyData } from "..";
import { UpdateTeamMemberRequest } from "../../../../requests/teamMember.requests";

export type Params = { partner_uid: string; uid: string };

export type RequestBody = UpdateTeamMemberRequest;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
