/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/team-services
 */

import { Types } from "@giusmento/mangojs-core";
import { TeamServicePost } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = undefined;

export type RequestBody = TeamServicePost;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
