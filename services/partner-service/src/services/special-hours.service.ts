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
type CreateSpecialHoursRequest =
  PBTypes.partner.requests.specialHours.CreateSpecialHoursRequest;
type UpdateSpecialHoursRequest =
  PBTypes.partner.requests.specialHours.UpdateSpecialHoursRequest;

@injectable()
export class SpecialHoursService {
  @inject(new LazyServiceIdentifier(() => INVERSITY_TYPES.PersistenceContext))
  private _persistenceContext: IPersistenceContext;

  constructor() {}

  /**
   * Create Special Hours - Create a new special hours slot
   *
   * @param data - Special hours creation data
   * @returns Promise resolving to the created special hours
   */
  public async create(
    data: CreateSpecialHoursRequest
  ): Promise<PBTypes.partner.entities.ShopSpecialHours> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
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

        // Validate: if not closed, must have start_time and end_time
        if (!data.is_closed && (!data.start_time || !data.end_time)) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "start_time and end_time are required when is_closed is false"
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

        const specialHours = em.create(models.ShopSpecialHours, {
          shop,
          special_date: data.special_date,
          is_recurring_annual: data.is_recurring_annual || false,
          start_time: data.start_time || null,
          end_time: data.end_time || null,
          slot_order: data.slot_order || 0,
          is_closed: data.is_closed || false,
          description: data.description || null,
        });
        await em.save(specialHours);
        return specialHours;
      }
    );
    return response as PBTypes.partner.entities.ShopSpecialHours;
  }

  /**
   * Get Special Hours By ID
   *
   * @param uid - Special hours ID
   * @returns Promise resolving to the special hours
   */
  public async findById(
    uid: string
  ): Promise<PBTypes.partner.entities.ShopSpecialHours> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const specialHours = await em.findOne(models.ShopSpecialHours, {
          where: { uid },
          relations: ["shop"],
        });

        if (!specialHours) {
          throw new errors.APIError(
            404,
            "NOT_FOUND",
            "Special hours not found"
          );
        }

        return specialHours;
      }
    );
    return response as PBTypes.partner.entities.ShopSpecialHours;
  }

  /**
   * Get All Special Hours for a Shop
   *
   * @param shop_uid - Shop ID
   * @returns Promise resolving to array of special hours
   */
  public async findByShop(
    shop_uid: string
  ): Promise<PBTypes.partner.entities.ShopSpecialHours[]> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const shop = await em.findOne(models.Shop, {
          where: { uid: shop_uid },
        });
        if (!shop) {
          throw new errors.APIError(400, "BAD_REQUEST", "Invalid shop UID");
        }

        const specialHours = await em.find(models.ShopSpecialHours, {
          where: { shop: { uid: shop_uid }, is_active: true },
          order: { special_date: "ASC", slot_order: "ASC" },
        });

        return specialHours;
      }
    );
    return response as PBTypes.partner.entities.ShopSpecialHours[];
  }

  /**
   * Get Special Hours for a specific date
   *
   * @param shop_uid - Shop ID
   * @param date - Date to check
   * @returns Promise resolving to array of special hours for that date
   */
  public async findByDate(
    shop_uid: string,
    date: Date
  ): Promise<PBTypes.partner.entities.ShopSpecialHours[]> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const shop = await em.findOne(models.Shop, {
          where: { uid: shop_uid },
        });
        if (!shop) {
          throw new errors.APIError(400, "BAD_REQUEST", "Invalid shop UID");
        }

        const specialHours = await em.find(models.ShopSpecialHours, {
          where: {
            shop: { uid: shop_uid },
            special_date: date,
            is_active: true,
          },
          order: { slot_order: "ASC" },
        });

        return specialHours;
      }
    );
    return response as PBTypes.partner.entities.ShopSpecialHours[];
  }

  /**
   * Update Special Hours
   *
   * @param uid - Special hours ID
   * @param data - Fields to update
   * @returns Promise resolving to updated special hours
   */
  public async update(
    uid: string,
    data: UpdateSpecialHoursRequest
  ): Promise<PBTypes.partner.entities.ShopSpecialHours> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const specialHours = await em.findOne(models.ShopSpecialHours, {
          where: { uid },
        });
        if (!specialHours) {
          throw new errors.APIError(
            404,
            "NOT_FOUND",
            "Special hours not found"
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

        Object.assign(specialHours, data);
        await em.save(specialHours);

        return specialHours;
      }
    );
    return response as PBTypes.partner.entities.ShopSpecialHours;
  }

  /**
   * Delete Special Hours - Soft delete by setting is_active to false
   *
   * @param uid - Special hours ID
   * @returns Promise resolving to true if successful
   */
  public async delete(uid: string): Promise<boolean> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const specialHours = await em.findOne(models.ShopSpecialHours, {
          where: { uid },
        });
        if (!specialHours) {
          throw new errors.APIError(
            404,
            "NOT_FOUND",
            "Special hours not found"
          );
        }

        specialHours.is_active = false;
        await em.save(specialHours);
        return true;
      }
    );
    return response;
  }
}
