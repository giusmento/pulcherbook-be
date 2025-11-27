/*
 * REQUEST
 * @see
 *
 * REQUEST: PUT /api/v1/shops/:shop_uid/special-hours/:uid
 */

import { Types } from "@giusmento/mangojs-core";
import { ShopSpecialHoursPut } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = { partnerUid: string; shopUid: string; uid: string };

export type RequestBody = ShopSpecialHoursPut;
export type RequestBodyMultiple = Array<ShopSpecialHoursPut>;

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
