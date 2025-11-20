/*
 * REQUEST
 * @see
 *
 * REQUEST: DELETE /api/v1/shops/:uid
 */

import { Types } from "@giusmento/mangojs-core";

export type Params = { uid: string };

export type RequestBody = {};

export type QueryParams = undefined;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<{ success: boolean }>;
