/**
 * ShopSpecialHours entity type definitions
 * These types define the shape of special hours data for API operations
 */

/**
 * Full ShopSpecialHours entity with all fields
 * This is the source of truth for the special hours structure
 */
export type ShopSpecialHours = {
  uid: string;
  shopUid: string;
  specialDate: string; // ISO date format: "2025-12-25"
  isRecurringAnnual: boolean;
  startTime: string | null; // e.g., "10:00:00"
  endTime: string | null; // e.g., "14:00:00"
  slotOrder: number;
  isClosed: boolean;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * API POST request body - Fields required when creating new special hours
 * Derived from ShopSpecialHours entity
 */
export type ShopSpecialHoursPost = Pick<
  ShopSpecialHours,
  | "specialDate"
  | "isRecurringAnnual"
  | "startTime"
  | "endTime"
  | "slotOrder"
  | "isClosed"
  | "description"
>;

/**
 * API PUT request body - Fields that can be updated on existing special hours
 * Derived from ShopSpecialHours entity
 */
export type ShopSpecialHoursPut = Partial<
  Pick<
    ShopSpecialHours,
    | "specialDate"
    | "isRecurringAnnual"
    | "startTime"
    | "endTime"
    | "slotOrder"
    | "isClosed"
    | "description"
    | "isActive"
  >
>;
