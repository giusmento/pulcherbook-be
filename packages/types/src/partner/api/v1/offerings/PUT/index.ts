/*
 * REQUEST
 * @see
 *
 * REQUEST: PUT /api/v1/services/:uid
 */

import { Types } from "@giusmento/mangojs-core";
import { OfferingPut } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = { uid: string };

export type RequestBody = OfferingPut;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
