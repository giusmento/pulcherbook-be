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
export type CreateSpecialHoursRequest = ShopSpecialHoursPost;

/**
 * Service layer: Update special hours request
 * Similar to API PUT but with Date type for special_date
 * Note: special_date is Date object (controller converts from API string)
 */
export type UpdateSpecialHoursRequest = ShopSpecialHoursPut;
