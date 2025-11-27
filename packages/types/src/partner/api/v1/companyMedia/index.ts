import { CompanyMedia } from "../../../entities";

export * as POST from "./POST";
export * as GET from "./GET";
export * as PUT from "./PUT";
export * as DELETE from "./DELETE";

export type ResponseBodyData = Pick<
  CompanyMedia,
  | "uid"
  | "partnerId"
  | "url"
  | "type"
  | "displayOrder"
  | "altText"
  | "createdAt"
  | "updatedAt"
>;
