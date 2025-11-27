export type BusinessType = {
  uid: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type BusinessTypeShort = Pick<
  BusinessType,
  "uid" | "name" | "description"
>;
