/**
 * Service layer request types for Shop
 * Used internally by the service methods
 */

import type { ShopPost, ShopPut } from "../entities";

/**
 * Service layer: Create shop request
 * Same as API ShopPost - can diverge if internal logic needs different fields
 */
export type CreateShopRequest = ShopPost;

/**
 * Service layer: Update shop request
 * Same as API ShopPut - can diverge if internal logic needs different fields
 */
export type UpdateShopRequest = ShopPut;
