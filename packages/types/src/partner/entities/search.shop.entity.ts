/**
 * Full Shop entity with all fields
 * This is the source of truth for the shop structure
 */
export type SearchShop = {
  uid: string;
  shopName: string;
  businessType: string;
  description: string;
  addressStreet: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressCountry: string | null;
  addressPostalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  phoneNumber: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};
