import { injectable, inject, LazyServiceIdentifier } from "inversify";
import { EntityManager } from "typeorm";
import {
  errors,
  INVERSITY_TYPES,
  IPersistenceContext,
} from "@giusmento/mangojs-core";
import * as models from "../db/models";
import type * as PBTypes from "@giusmento/pulcherbook-types";

// Import service layer request types from shared package
type UpsertWorkingHoursRequest =
  PBTypes.partner.requests.workingHours.UpsertWorkingHoursRequest;

@injectable()
export class WorkingHoursService {
  @inject(new LazyServiceIdentifier(() => INVERSITY_TYPES.PersistenceContext))
  private _persistenceContext: IPersistenceContext;

  constructor() {}

  /**
   * Get All Working Hours for a Shop
   *
   * @param shop_uid - Shop ID
   * @returns Promise resolving to array of working hours
   */
  public async findByShop(
    shop_uid: string
  ): Promise<PBTypes.partner.entities.ShopWorkingHours[]> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const shop = await em.findOne(models.Shop, {
          where: { uid: shop_uid },
        });
        if (!shop) {
          throw new errors.APIError(400, "BAD_REQUEST", "Invalid shop UID");
        }

        const workingHours = await em.find(models.ShopWorkingHours, {
          where: { shop: { uid: shop_uid }, is_active: true },
          order: { day_of_week: "ASC", slot_order: "ASC" },
        });

        return workingHours;
      }
    );
    return response as PBTypes.partner.entities.ShopWorkingHours[];
  }

  /**
   * Update Working Hours
   *
   * @param shop_uid - Working hours ID
   * @param data - Fields to update
   * @returns Promise resolving to updated working hours
   */
  public async upsert(
    shop_uid: string,
    data: UpsertWorkingHoursRequest
  ): Promise<PBTypes.partner.entities.ShopWorkingHours[]> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        // prepare working hours
        const workingHours: UpsertWorkingHoursRequest = [];
        // validate data and upsert each entry
        for (const entry of data) {
          // validate day_of_week if provided
          if (
            entry.day_of_week !== undefined &&
            (entry.day_of_week < 0 || entry.day_of_week > 6)
          ) {
            throw new errors.APIError(
              400,
              "BAD_REQUEST",
              "day_of_week must be between 0 (Sunday) and 6 (Saturday)"
            );
          }

          // validate time format if provided
          const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
          if (entry.start_time && !timeRegex.test(entry.start_time)) {
            throw new errors.APIError(
              400,
              "BAD_REQUEST",
              "Invalid start_time format"
            );
          }
          if (entry.end_time && !timeRegex.test(entry.end_time)) {
            throw new errors.APIError(
              400,
              "BAD_REQUEST",
              "Invalid end_time format"
            );
          }

          workingHours.push({
            day_of_week: entry.day_of_week,
            start_time: entry.start_time,
            end_time: entry.end_time,
            is_active: entry.is_active,
          });
        }

        //search shop id
        const shop = await em.findOne(models.Shop, {
          where: { uid: shop_uid },
        });
        if (!shop) {
          throw new errors.APIError(400, "BAD_REQUEST", "Invalid shop UID");
        }
        // add shop relation to each entry
        for (const wh of workingHours) {
          (wh as any).shop = shop;
        }
        // delete existing working hours for the shop
        await em.delete(models.ShopWorkingHours, { shop: { uid: shop_uid } });

        // insert new working hours
        const responseApi = await em.save(
          models.ShopWorkingHours,
          workingHours
        );

        const response = responseApi.map((wh) => {
          return {
            uid: wh.uid,
            shop_uid: shop.uid,
            day_of_week: wh.day_of_week,
            start_time: wh.start_time,
            end_time: wh.end_time,
            slot_order: wh.slot_order,
            is_active: wh.is_active,
          };
        });

        return response;
      }
    );
    return response as PBTypes.partner.entities.ShopWorkingHours[];
  }

  /**
   * Delete Working Hours - Soft delete by setting is_active to false
   *
   * @param uid - Working hours ID
   * @returns Promise resolving to true if successful
   */
  public async delete(uid: string): Promise<boolean> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const workingHours = await em.findOne(models.ShopWorkingHours, {
          where: { uid },
        });
        if (!workingHours) {
          throw new errors.APIError(
            404,
            "NOT_FOUND",
            "Working hours not found"
          );
        }

        workingHours.is_active = false;
        await em.save(workingHours);
        return true;
      }
    );
    return response as boolean;
  }
}
