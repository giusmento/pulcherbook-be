/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/partners/:partner_uid/teams
 */

import { Types } from "@giusmento/mangojs-core";
import { CreateTeamRequest } from "../../../../requests/team.requests";
import { ResponseBodyData } from "..";

export type Params = { partnerUid: string };

export type RequestBody = CreateTeamRequest;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
