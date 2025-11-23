/*
 * REQUEST
 * @see
 *
 * REQUEST: PUT /api/v1/shops/:shop_uid/working-hours/:uid
 */

import { Types } from "@giusmento/mangojs-core";
import { ResponseBodyData } from "..";
import { UpsertWorkingHoursRequest } from "../../../../requests/working-hours.requests";

export type Params = { partner_uid: string; shop_uid: string };

export type RequestBody = UpsertWorkingHoursRequest;

export type QueryParams = {};

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<
  Array<ResponseBodyData>
>;
