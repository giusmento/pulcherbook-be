/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/availability
 */

import { Types } from "@giusmento/mangojs-core";
import { AvailabilityPost } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = undefined;

export type RequestBody = AvailabilityPost;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
