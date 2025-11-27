/*
 * REQUEST
 * @see
 *
 * REQUEST: GET /api/v1/partners/:uid/availability
 */

import { Types } from "@giusmento/mangojs-core";
import { TeamMemberAvailability } from "../../../../../entities";

export type Params = { uid: string };

export type RequestBody = {};

/**
 * RESPONSE
 *
 * @see
 */

export type ResponseBodyData = Omit<TeamMemberAvailability, "createdAt" | "updatedAt">;

export type ResponseBody = Types.v1.api.response.response<
  Array<ResponseBodyData>
>;
