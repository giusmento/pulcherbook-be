/*
 * REQUEST
 * @see
 *
 * REQUEST: PUT /api/v1/teams/:uid
 */

import { Types } from "@giusmento/mangojs-core";
import { TeamPut } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = { uid: string };

export type RequestBody = TeamPut;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
