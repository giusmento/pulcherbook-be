/*
 * REQUEST
 * @see
 *
 * REQUEST: PUT /api/v1/shops/:uid
 */

import { Types } from "@giusmento/mangojs-core";
import { ShopPut } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = { uid: string };

export type RequestBody = ShopPut;

export type QueryParams = undefined;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
