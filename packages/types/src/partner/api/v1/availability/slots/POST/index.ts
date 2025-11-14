/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/availability/slots
 */

import { Types } from "@giusmento/mangojs-core";

export type Params = undefined;

export type RequestBody = {
  team_member_id: string;
  date: string; // YYYY-MM-DD
  service_id: string;
};

/**
 * RESPONSE
 *
 * @see
 */

export type TimeSlot = {
  start_time: string;
  end_time: string;
  available: boolean;
};

export type ResponseBody = Types.v1.api.response.response<Array<TimeSlot>>;
