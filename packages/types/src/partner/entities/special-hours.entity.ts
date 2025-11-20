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
  shop_uid: string;
  special_date: string; // ISO date format: "2025-12-25"
  is_recurring_annual: boolean;
  start_time: string | null; // e.g., "10:00:00"
  end_time: string | null; // e.g., "14:00:00"
  slot_order: number;
  is_closed: boolean;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * API POST request body - Fields required when creating new special hours
 * Derived from ShopSpecialHours entity
 */
export type ShopSpecialHoursPost = Pick<ShopSpecialHours, "special_date"> & {
  is_recurring_annual?: boolean; // Optional with default false
  start_time?: string | null;
  end_time?: string | null;
  slot_order?: number; // Optional with default 0
  is_closed?: boolean; // Optional with default false
  description?: string | null;
};

/**
 * API PUT request body - Fields that can be updated on existing special hours
 * Derived from ShopSpecialHours entity
 */
export type ShopSpecialHoursPut = Partial<
  Pick<
    ShopSpecialHours,
    | "special_date"
    | "is_recurring_annual"
    | "start_time"
    | "end_time"
    | "slot_order"
    | "is_closed"
    | "description"
    | "is_active"
  >
>;
