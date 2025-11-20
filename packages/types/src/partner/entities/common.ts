export type BusinessType = {
  uid: string;
  name: string;
  description: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
};

export type BusinessTypeShort = Pick<
  BusinessType,
  "uid" | "name" | "description"
>;
