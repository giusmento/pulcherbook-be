/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/appointments
 */

import { Types } from "@giusmento/mangojs-core";
import { AppointmentPost } from "../../../../entities";
import { ResponseBodyData } from "..";

export type Params = undefined;

export type RequestBody = AppointmentPost;

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
