/*
 * REQUEST
 * @see
 *
 * REQUEST: PUT /api/v1/appointments/:uid
 */

import { Types } from "@giusmento/mangojs-core";
import { AppointmentPut } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = { uid: string };

export type RequestBody = AppointmentPut;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
