/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/shops/:shop_uid/special-hours
 */

import { Types } from "@giusmento/mangojs-core";
import { ShopSpecialHoursPost } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = { partner_uid: string; shop_uid: string };

export type RequestBody = ShopSpecialHoursPost;
export type RequestBodyMultiple = Array<ShopSpecialHoursPost>;

export type QueryParams = {};

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
export type ResponseBodyMultiple = Types.v1.api.response.response<
  Array<ResponseBodyData>
>;
