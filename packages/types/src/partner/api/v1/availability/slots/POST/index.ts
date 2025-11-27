/*
 * REQUEST
 * @see
 *
 * REQUEST: POST /api/v1/availability/slots
 */

import { Types } from "@giusmento/mangojs-core";

export type Params = undefined;

export type RequestBody = {
  teamMemberId: string;
  date: string; // YYYY-MM-DD
  serviceId: string;
};

/**
 * RESPONSE
 *
 * @see
 */

export type TimeSlot = {
  startTime: string;
  endTime: string;
  available: boolean;
};

export type ResponseBody = Types.v1.api.response.response<Array<TimeSlot>>;
