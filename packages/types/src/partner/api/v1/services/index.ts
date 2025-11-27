import { Service } from "../../../entities";

export * as POST from "./POST";
export * as GET from "./GET";
export * as PUT from "./PUT";
export * as DELETE from "./DELETE";

export type ResponseBodyData = Pick<
  Service,
  | "uid"
  | "partnerId"
  | "name"
  | "description"
  | "durationMinutes"
  | "price"
  | "currency"
  | "status"
  | "createdAt"
  | "updatedAt"
>;
