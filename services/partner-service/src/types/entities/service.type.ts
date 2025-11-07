import * as models from "../../db/models";

export type Service = models.Service;
export type ServicePost = Pick<
  Service,
  "partner_id" | "name" | "description" | "duration_minutes" | "price" | "currency"
>;
export type ServicePut = Partial<Omit<ServicePost, "partner_id">>;
