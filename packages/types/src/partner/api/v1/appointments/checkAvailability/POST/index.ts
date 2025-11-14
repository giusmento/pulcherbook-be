/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/appointments/check-availability
 */

import { Types } from "@giusmento/mangojs-core";

export type Params = undefined;

export type RequestBody = {
  team_member_id: string;
  appointment_date: string;
  duration_minutes: number;
};

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBodyData = {
  available: boolean;
};

export type ResponseBody = Types.v1.api.response.response<ResponseBodyData>;
