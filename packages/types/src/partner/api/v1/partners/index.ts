import { Partner, Team, Service } from "../../../entities";

export * as POST from "./POST";
export * as GET from "./GET";
export * as PUT from "./PUT";
export * as DELETE from "./DELETE";
export * as search from "./search";
export * as availability from "./availability";
export * as isProfileCompleted from "./isProfileCompleted";

export type ResponseBodyData = Pick<
  Partner,
  | "uid"
  | "external_uid"
  | "company_name"
  | "description"
  | "address"
  | "city"
  | "state"
  | "country"
  | "postal_code"
  | "phone"
  | "email"
  | "website"
  | "status"
  | "created_at"
  | "updated_at"
> & {
  business_type: {
    uid: string;
    name: string;
  };
};
