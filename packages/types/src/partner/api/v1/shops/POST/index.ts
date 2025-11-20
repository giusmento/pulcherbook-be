/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/shops
 */

import { Types } from "@giusmento/mangojs-core";
import { ShopPost } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = { partner_uid: string };

export type RequestBody = ShopPost;

export type QueryParams = undefined;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
