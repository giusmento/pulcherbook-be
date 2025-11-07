import * as models from "../../db/models";

export type Partner = models.Partner;
export type PartnerPost = Pick<
  Partner,
  | "owner_user_id"
  | "company_name"
  | "description"
  | "address"
  | "city"
  | "state"
  | "country"
  | "postal_code"
  | "latitude"
  | "longitude"
  | "phone"
  | "email"
  | "website"
>;
export type PartnerPut = Partial<Omit<PartnerPost, "owner_user_id">>;
