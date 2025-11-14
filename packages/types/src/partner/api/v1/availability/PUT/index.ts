/*
 * REQUEST
 * @see
 *
 * REQUEST: PUT /api/v1/availability/:uid
 */

import { Types } from "@giusmento/mangojs-core";
import { AvailabilityPut } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = { uid: string };

export type RequestBody = AvailabilityPut;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
