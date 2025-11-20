/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/shops
 */

import { Types } from "@giusmento/mangojs-core";
import { ResponseBodyData } from "../../";

export type RequestParams = { partner_uid: string; uid: string };

export type RequestBody = undefined;

export type QueryParams = undefined;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
