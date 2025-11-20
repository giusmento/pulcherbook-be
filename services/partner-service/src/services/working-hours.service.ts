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
type CreateWorkingHoursRequest =
  PBTypes.partner.requests.workingHours.CreateWorkingHoursRequest;
type UpdateWorkingHoursRequest =
  PBTypes.partner.requests.workingHours.UpdateWorkingHoursRequest;

@injectable()
export class WorkingHoursService {
  @inject(new LazyServiceIdentifier(() => INVERSITY_TYPES.PersistenceContext))
  private _persistenceContext: IPersistenceContext;

  constructor() {}

  /**
   * Create Working Hours - Create a new working hours slot
   *
   * @param data - Working hours creation data
   * @returns Promise resolving to the created working hours
   */
  public async create(
    data: CreateWorkingHoursRequest
  ): Promise<PBTypes.partner.entities.ShopWorkingHours> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        // Validate day_of_week (0-6)
        if (data.day_of_week < 0 || data.day_of_week > 6) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "day_of_week must be between 0 (Sunday) and 6 (Saturday)"
          );
        }

        // Verify shop exists
        const shop = await em.findOne(models.Shop, {
          where: { uid: data.shop_uid },
        });
        if (!shop) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            `Shop with UID ${data.shop_uid} not found`
          );
        }

        // Validate time format (basic check)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
        if (
          !timeRegex.test(data.start_time) ||
          !timeRegex.test(data.end_time)
        ) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "Invalid time format. Use HH:MM or HH:MM:SS"
          );
        }

        const workingHours = em.create(models.ShopWorkingHours, {
          shop,
          day_of_week: data.day_of_week,
          start_time: data.start_time,
          end_time: data.end_time,
          slot_order: data.slot_order || 0,
        });
        await em.save(workingHours);
        return workingHours;
      }
    );
    return response as PBTypes.partner.entities.ShopWorkingHours;
  }

  /**
   * Get Working Hours By ID
   *
   * @param uid - Working hours ID
   * @returns Promise resolving to the working hours
   */
  public async findById(
    uid: string
  ): Promise<PBTypes.partner.entities.ShopWorkingHours> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const workingHours = await em.findOne(models.ShopWorkingHours, {
          where: { uid },
          relations: ["shop"],
        });

        if (!workingHours) {
          throw new errors.APIError(
            404,
            "NOT_FOUND",
            "Working hours not found"
          );
        }

        return workingHours;
      }
    );
    return response as PBTypes.partner.entities.ShopWorkingHours;
  }

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
   * @param uid - Working hours ID
   * @param data - Fields to update
   * @returns Promise resolving to updated working hours
   */
  public async update(
    uid: string,
    data: UpdateWorkingHoursRequest
  ): Promise<PBTypes.partner.entities.ShopWorkingHours> {
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

        // Validate day_of_week if provided
        if (
          data.day_of_week !== undefined &&
          (data.day_of_week < 0 || data.day_of_week > 6)
        ) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "day_of_week must be between 0 (Sunday) and 6 (Saturday)"
          );
        }

        // Validate time format if provided
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
        if (data.start_time && !timeRegex.test(data.start_time)) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "Invalid start_time format"
          );
        }
        if (data.end_time && !timeRegex.test(data.end_time)) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "Invalid end_time format"
          );
        }

        Object.assign(workingHours, data);
        await em.save(workingHours);

        return workingHours;
      }
    );
    return response as PBTypes.partner.entities.ShopWorkingHours;
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
    return response;
  }
}
