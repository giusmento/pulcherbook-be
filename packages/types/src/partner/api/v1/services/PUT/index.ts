/*
 * REQUEST
 * @see
 *
 * REQUEST: PUT /api/v1/services/:uid
 */

import { Types } from "@giusmento/mangojs-core";
import { ServicePut } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = { uid: string };

export type RequestBody = ServicePut;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
