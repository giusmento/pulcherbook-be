import { Service } from "../../../entities";

export * as POST from "./POST";
export * as GET from "./GET";
export * as PUT from "./PUT";
export * as DELETE from "./DELETE";

export type ResponseBodyData = Pick<
  Service,
  | "uid"
  | "partner_id"
  | "name"
  | "description"
  | "duration_minutes"
  | "price"
  | "currency"
  | "status"
  | "created_at"
  | "updated_at"
>;
