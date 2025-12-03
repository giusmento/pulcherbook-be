/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/services
 */

import { Types } from "@giusmento/mangojs-core";
import { OfferingPost } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = undefined;

export type RequestBody = OfferingPost;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
