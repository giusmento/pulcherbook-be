/*
 * REQUEST
 * @see
 *
 * REQUEST: GET /api/v1/catalog/business-types
 */

import { Types } from "@giusmento/mangojs-core";

export type Params = undefined;
export type RequestBody = {};

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBodyData = {
  uid: string;
  name: string;
  description: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
};

export type ResponseBody = Types.v1.api.response.response<
  Array<ResponseBodyData>
>;
