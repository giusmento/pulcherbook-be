import { CompanyMedia } from "../../../entities";

export * as POST from "./POST";
export * as GET from "./GET";
export * as PUT from "./PUT";
export * as DELETE from "./DELETE";

export type ResponseBodyData = Pick<
  CompanyMedia,
  | "uid"
  | "partner_id"
  | "url"
  | "type"
  | "display_order"
  | "alt_text"
  | "created_at"
  | "updated_at"
>;
