/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/partners
 */

import { Types } from "@giusmento/mangojs-core";
import { PartnerPost } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = undefined;

export type RequestBody = PartnerPost;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
