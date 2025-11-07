import * as models from "../../db/models";

export type CompanyMedia = models.CompanyMedia;
export type CompanyMediaPost = Pick<
  CompanyMedia,
  "partner_id" | "url" | "type" | "display_order" | "alt_text"
>;
export type CompanyMediaPut = Partial<Omit<CompanyMediaPost, "partner_id" | "url" | "type">>;
