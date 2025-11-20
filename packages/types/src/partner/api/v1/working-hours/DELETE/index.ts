/*
 * REQUEST
 * @see
 *
 * REQUEST: DELETE /api/v1/shops/:shop_uid/working-hours/:uid
 */

import { Types } from "@giusmento/mangojs-core";

export type Params = { shop_uid: string; uid: string };

export type RequestBody = {};

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<{ success: boolean }>;
