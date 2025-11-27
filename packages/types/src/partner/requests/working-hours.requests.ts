/**
 * Service layer request types for ShopWorkingHours
 * Used internally by the service methods
 */

import type { ShopWorkingHoursPut } from "../entities";

/**
 * Service layer: Update working hours request
 * Same as API PUT type - can diverge if internal logic needs different fields
 */
export type UpsertWorkingHoursRequest = Array<ShopWorkingHoursPut>;
