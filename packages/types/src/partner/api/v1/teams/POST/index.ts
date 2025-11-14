/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/teams
 */

import { Types } from "@giusmento/mangojs-core";
import { TeamPost } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = undefined;

export type RequestBody = TeamPost;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
