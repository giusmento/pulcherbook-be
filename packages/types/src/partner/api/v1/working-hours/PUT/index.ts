/*
 * REQUEST
 * @see
 *
 * REQUEST: PUT /api/v1/shops/:shop_uid/working-hours/:uid
 */

import { Types } from "@giusmento/mangojs-core";
import { ShopWorkingHoursPut } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = { shop_uid: string; uid: string };

export type RequestBody = ShopWorkingHoursPut;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
