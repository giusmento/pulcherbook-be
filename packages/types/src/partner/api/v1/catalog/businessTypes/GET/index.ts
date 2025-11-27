/*
 * REQUEST
 * @see
 *
 * REQUEST: GET /api/v1/catalog/business-types
 */

import { Types } from "@giusmento/mangojs-core";
import { BusinessType } from "../../../../../entities/common";

export type Params = undefined;
export type RequestBody = {};

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBodyData = BusinessType;

export type ResponseBody = Types.v1.api.response.response<
  Array<ResponseBodyData>
>;
