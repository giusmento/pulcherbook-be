/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/shops/:shop_uid/working-hours
 */

import { Types } from "@giusmento/mangojs-core";
import { ShopWorkingHoursPost } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = { shop_uid: string };

export type RequestBody = ShopWorkingHoursPost;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
