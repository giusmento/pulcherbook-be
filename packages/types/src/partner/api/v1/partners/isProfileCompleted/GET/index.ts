/*
 * REQUEST
 * @see
 *
 * REQUEST: GET /api/v1/partners/:uid/isProfileCompleted
 */

import { Types } from "@giusmento/mangojs-core";

export type Params = { uid: string };

export type RequestBody = {};

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBodyData = {
  isCompleted: boolean;
  missingFields?: string[];
};

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
