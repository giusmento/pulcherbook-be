/*
 * REQUEST
 * @see
 *
 * REQUEST: PUT /api/v1/company-media/:uid
 */

import { Types } from "@giusmento/mangojs-core";
import { CompanyMediaPut } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = { uid: string };

export type RequestBody = CompanyMediaPut;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
