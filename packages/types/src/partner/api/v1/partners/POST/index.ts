/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/partners
 */

import { Types } from "@giusmento/mangojs-core";
import { PartnerWithUserPost } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = undefined;

export type RequestBody = PartnerWithUserPost;

export type QueryParams = undefined;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
