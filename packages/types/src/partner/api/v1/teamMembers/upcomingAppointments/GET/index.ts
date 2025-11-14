/*
 * REQUEST
 * @see
 *
 * REQUEST: GET /api/v1/team-members/:uid/upcoming-appointments
 */

import { Types } from "@giusmento/mangojs-core";
import { Appointment } from "../../../../../entities";

export type Params = { uid: string };
export type RequestBody = {};

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBodyData = Omit<Appointment, "cancellation_reason" | "created_at" | "updated_at">;

export type ResponseBody = Types.v1.api.response.response<
  Array<ResponseBodyData>
>;
