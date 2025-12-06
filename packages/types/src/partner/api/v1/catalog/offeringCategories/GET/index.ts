/*
 * REQUEST
 * @see
 *
 * REQUEST: GET /api/v1/catalog/offering-categories
 */

import { Types } from "@giusmento/mangojs-core";
import { OfferingCategory } from "../../../../../entities/offering-category.entity";

export type Params = undefined;
export type RequestBody = {};

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBodyData = OfferingCategory;

export type ResponseBody = Types.v1.api.response.response<
  Array<ResponseBodyData>
>;
