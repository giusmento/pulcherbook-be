/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/partners/search
 */

import { Types } from "@giusmento/mangojs-core";
import { ResponseBodyData } from "../..";

export type Params = undefined;

export type RequestBody = {
  latitude?: number;
  longitude?: number;
  radius?: number; // in kilometers
  service_id?: string;
  city?: string;
  limit?: number;
  offset?: number;
};

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<
  Array<ResponseBodyData>
>;
