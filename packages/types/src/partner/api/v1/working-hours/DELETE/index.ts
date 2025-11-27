/*
 * REQUEST
 * @see
 *
 * REQUEST: DELETE /api/v1/shops/:shop_uid/working-hours/:uid
 */

import { Types } from "@giusmento/mangojs-core";

export type Params = { partnerUid: string; shopUid: string; uid: string };

export type RequestBody = {};

export type QueryParams = {};

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<{ success: boolean }>;
