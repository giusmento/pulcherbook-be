/**
 * Service layer request types for ShopWorkingHours
 * Used internally by the service methods
 */

import type { ShopWorkingHoursPost, ShopWorkingHoursPut } from "../entities";

/**
 * Service layer: Create working hours request
 * Extends API POST type with service-specific field (shop_uid added by controller)
 */
export interface CreateWorkingHoursRequest extends ShopWorkingHoursPost {}

/**
 * Service layer: Update working hours request
 * Same as API PUT type - can diverge if internal logic needs different fields
 */
export type UpdateWorkingHoursRequest = ShopWorkingHoursPut;
