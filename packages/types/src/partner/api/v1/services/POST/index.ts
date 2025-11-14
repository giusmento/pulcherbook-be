/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/services
 */

import { Types } from "@giusmento/mangojs-core";
import { ServicePost } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = undefined;

export type RequestBody = ServicePost;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
