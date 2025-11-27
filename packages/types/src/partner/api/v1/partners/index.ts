import { Partner } from "../../../entities";

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
  | "externalUid"
  | "companyName"
  | "description"
  | "addressStreet"
  | "addressCity"
  | "addressState"
  | "addressCountry"
  | "addressPostalCode"
  | "phoneNumber"
  | "email"
  | "website"
  | "status"
  | "createdAt"
  | "updatedAt"
> & {
  businessType: {
    uid: string;
    name: string;
  };
};
