/**
 * Service layer request types for ShopSpecialHours
 * Used internally by the service methods
 */

import type { ShopSpecialHoursPost, ShopSpecialHoursPut } from "../entities";

/**
 * Service layer: Create special hours request
 * Extends API POST type with service-specific fields
 * Note: special_date is Date object (controller converts from API string)
 */
export interface CreateSpecialHoursRequest
  extends Omit<ShopSpecialHoursPost, "special_date"> {
  special_date: Date; // Service layer uses Date object (API uses string)
}

/**
 * Service layer: Update special hours request
 * Similar to API PUT but with Date type for special_date
 * Note: special_date is Date object (controller converts from API string)
 */
export interface UpdateSpecialHoursRequest
  extends Omit<ShopSpecialHoursPut, "special_date"> {
  special_date?: Date; // Service layer uses Date object (API uses string)
}
