/*
 * REQUEST
 * @see
 *
 * REQUEST: PUT /api/v1/partners/:uid
 */

import { Types } from "@giusmento/mangojs-core";
import { PartnerPut } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = { uid: string };

export type RequestBody = PartnerPut;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
