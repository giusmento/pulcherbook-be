/*
 * REQUEST
 * @see
 *
 * REQUEST: PUT /api/v1/partners/:partner_uid/teams/:uid
 */

import { Types } from "@giusmento/mangojs-core";
import { UpdateTeamRequest } from "../../../../requests/team.requests";
import { ResponseBodyData } from "..";

export type Params = { partnerUid: string; uid: string };

export type RequestBody = UpdateTeamRequest;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
