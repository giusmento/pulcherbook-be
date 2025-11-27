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
          where: { shop: { uid: shop_uid }, isActive: true },
          order: { dayOfWeek: "ASC", slotOrder: "ASC" },
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
          // validate dayOfWeek if provided
          if (
            entry.dayOfWeek !== undefined &&
            (entry.dayOfWeek < 0 || entry.dayOfWeek > 6)
          ) {
            throw new errors.APIError(
              400,
              "BAD_REQUEST",
              "dayOfWeek must be between 0 (Sunday) and 6 (Saturday)"
            );
          }

          // validate time format if provided
          const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
          if (entry.startTime && !timeRegex.test(entry.startTime)) {
            throw new errors.APIError(
              400,
              "BAD_REQUEST",
              "Invalid startTime format"
            );
          }
          if (entry.endTime && !timeRegex.test(entry.endTime)) {
            throw new errors.APIError(
              400,
              "BAD_REQUEST",
              "Invalid endTime format"
            );
          }

          workingHours.push({
            dayOfWeek: entry.dayOfWeek,
            startTime: entry.startTime,
            endTime: entry.endTime,
            isActive: entry.isActive,
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
            shopUid: shop.uid,
            dayOfWeek: wh.dayOfWeek,
            startTime: wh.startTime,
            endTime: wh.endTime,
            slotOrder: wh.slotOrder,
            isActive: wh.isActive,
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

        workingHours.isActive = false;
        await em.save(workingHours);
        return true;
      }
    );
    return response as boolean;
  }
}
