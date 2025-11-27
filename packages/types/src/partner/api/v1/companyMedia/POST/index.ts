/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/company-media
 */

import { Types } from "@giusmento/mangojs-core";
import { CompanyMediaPost } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = undefined;

export type RequestBody = CompanyMediaPost;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
