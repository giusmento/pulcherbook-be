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
    shop_uid: string,
    data: CreateSpecialHoursRequest
  ): Promise<PBTypes.partner.entities.ShopSpecialHours> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        // Verify shop exists
        const shop = await em.findOne(models.Shop, {
          where: { uid: shop_uid },
        });
        if (!shop) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            `Shop with UID ${shop_uid} not found`
          );
        }

        // Validate: if not closed, must have startTime and endTime
        if (!data.isClosed && (!data.startTime || !data.endTime)) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "startTime and endTime are required when isClosed is false"
          );
        }

        // Validate time format if provided
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
        if (data.startTime && !timeRegex.test(data.startTime)) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "Invalid startTime format"
          );
        }
        if (data.endTime && !timeRegex.test(data.endTime)) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "Invalid endTime format"
          );
        }

        const specialHours = em.create(models.ShopSpecialHours, {
          shop,
          specialDate: data.specialDate,
          isRecurringAnnual: data.isRecurringAnnual || false,
          startTime: data.startTime || null,
          endTime: data.endTime || null,
          slotOrder: data.slotOrder || 0,
          isClosed: data.isClosed || false,
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
          where: { shop: { uid: shop_uid }, isActive: true },
          order: { specialDate: "ASC", slotOrder: "ASC" },
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
            specialDate: date,
            isActive: true,
          },
          order: { slotOrder: "ASC" },
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
    shop_uid: string,
    data: UpdateSpecialHoursRequest
  ): Promise<PBTypes.partner.entities.ShopSpecialHours> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const specialHours = await em.findOne(models.ShopSpecialHours, {
          where: { shop: { uid: shop_uid } },
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
        if (data.startTime && !timeRegex.test(data.startTime)) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "Invalid startTime format"
          );
        }
        if (data.endTime && !timeRegex.test(data.endTime)) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "Invalid endTime format"
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
   * Update Special Hours Multiple
   *
   * @param uid - Special hours ID
   * @param data - Fields to update
   * @returns Promise resolving to updated special hours
   */
  public async updateMultiple(
    shop_uid: string,
    data: UpdateSpecialHoursRequest[]
  ): Promise<PBTypes.partner.entities.ShopSpecialHours[]> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        // prepare special hours array
        const specialHours = [];
        // validate each item in data array
        for (const item of data) {
          // Validate time format if provided
          const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
          if (item.startTime && !timeRegex.test(item.startTime)) {
            throw new errors.APIError(
              400,
              "BAD_REQUEST",
              "Invalid startTime format"
            );
          }
          if (item.endTime && !timeRegex.test(item.endTime)) {
            throw new errors.APIError(
              400,
              "BAD_REQUEST",
              "Invalid endTime format"
            );
          }
          specialHours.push({
            specialDate: item.specialDate,
            isRecurringAnnual: item.isRecurringAnnual,
            startTime: item.startTime,
            endTime: item.endTime,
            slotOrder: item.slotOrder || 0,
            isClosed: item.isClosed,
            description: item.description,
            isActive: item.isActive,
          });
        }

        // find shop by uid
        const shop = await em.findOne(models.Shop, {
          where: { uid: shop_uid },
        });
        if (!shop) {
          throw new errors.APIError(
            404,
            "NOT_FOUND",
            "Special hours not found"
          );
        }

        // add shop to each special hours item
        for (const sh of specialHours) {
          sh.shop = shop;
        }
        // remove existing special hours for the shop
        await em.delete(models.ShopSpecialHours, { shop: { uid: shop_uid } });
        // save all special hours
        const responseApi = await em.save(
          models.ShopSpecialHours,
          specialHours
        );

        const response = responseApi.map((wh) => {
          return {
            uid: wh.uid,
            specialDate: wh.specialDate,
            isRecurringAnnual: wh.isRecurringAnnual,
            shopUid: shop.uid,
            description: wh.description,
            startTime: wh.startTime,
            endTime: wh.endTime,
            slotOrder: wh.slotOrder,
            isActive: wh.isActive,
            createdAt: wh.createdAt,
            updatedAt: wh.updatedAt,
          };
        });

        return response;
      }
    );
    return response as PBTypes.partner.entities.ShopSpecialHours[];
  }

  /**
   * Delete Special Hours - Soft delete by setting is_active to false
   *
   * @param uid - Special hours ID
   * @returns Promise resolving to true if successful
   */
  public async delete(shop_uid: string, uid: string): Promise<boolean> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const specialHours = await em.findOne(models.ShopSpecialHours, {
          where: { uid, shop: { uid: shop_uid } },
        });
        if (!specialHours) {
          throw new errors.APIError(
            404,
            "NOT_FOUND",
            "Special hours not found"
          );
        }

        specialHours.isActive = false;
        await em.save(specialHours);
        return true;
      }
    );
    return response as boolean;
  }
}
