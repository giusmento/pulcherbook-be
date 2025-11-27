/**
 * ShopWorkingHours entity type definitions
 * These types define the shape of working hours data for API operations
 */

/**
 * Full ShopWorkingHours entity with all fields
 * This is the source of truth for the working hours structure
 */
export type ShopWorkingHours = {
  uid: string;
  shopUid: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: string; // e.g., "08:00:00"
  endTime: string; // e.g., "13:00:00"
  slotOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * API PUT request body - Fields that can be updated on existing working hours
 * Derived from ShopWorkingHours entity
 */
export type ShopWorkingHoursPut = Partial<
  Pick<
    ShopWorkingHours,
    "dayOfWeek" | "startTime" | "endTime" | "slotOrder" | "isActive"
  >
>;
