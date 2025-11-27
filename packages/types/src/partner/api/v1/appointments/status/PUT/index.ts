/*
 * REQUEST
 * @see
 *
 * REQUEST: PUT /api/v1/appointments/:uid/status
 */

import { Types } from "@giusmento/mangojs-core";
import { ResponseBodyData } from "../..";

export type Params = { uid: string };

export type RequestBody = {
  status: string;
  cancellationReason: string | null;
};

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
