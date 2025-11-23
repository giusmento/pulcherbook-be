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
  shop_uid: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  start_time: string; // e.g., "08:00:00"
  end_time: string; // e.g., "13:00:00"
  slot_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * API PUT request body - Fields that can be updated on existing working hours
 * Derived from ShopWorkingHours entity
 */
export type ShopWorkingHoursPut = Partial<
  Pick<
    ShopWorkingHours,
    "day_of_week" | "start_time" | "end_time" | "slot_order" | "is_active"
  >
>;
