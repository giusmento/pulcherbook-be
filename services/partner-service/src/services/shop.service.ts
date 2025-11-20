import { injectable, inject, LazyServiceIdentifier } from "inversify";
import { EntityManager } from "typeorm";
import {
  errors,
  INVERSITY_TYPES,
  IPersistenceContext,
} from "@giusmento/mangojs-core";
import * as models from "../db/models";
import * as enums from "../catalog/enums";
import type * as PBTypes from "@giusmento/pulcherbook-types";

// Import service layer request types from shared package
type CreateShopRequest = PBTypes.partner.requests.shop.CreateShopRequest;
type UpdateShopRequest = PBTypes.partner.requests.shop.UpdateShopRequest;

@injectable()
export class ShopService {
  @inject(new LazyServiceIdentifier(() => INVERSITY_TYPES.PersistenceContext))
  private _persistenceContext: IPersistenceContext;

  constructor() {}

  /**
   * Create Shop - Create a new shop with validation
   *
   * @param data - Shop creation data
   * @returns Promise resolving to the created shop
   * @throws {APIError} 400 BAD_REQUEST if shop name or partner_uid is missing
   */
  public async create(
    data: CreateShopRequest
  ): Promise<PBTypes.partner.entities.Shop> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        // Validation
        if (!data.shop_name) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "Shop name is required"
          );
        }
        if (!data.partner_uid) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "Partner UID is required"
          );
        }

        // Verify partner exists
        const partner = await em.findOne(models.Partner, {
          where: { uid: data.partner_uid },
        });
        if (!partner) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            `Partner with UID ${data.partner_uid} not found`
          );
        }

        // Create and save using em
        const shop = em.create(models.Shop, data);
        await em.save(shop);
        return shop;
      }
    );
    return response as PBTypes.partner.entities.Shop;
  }

  /**
   * Get Shop By ID - Retrieve a shop by its ID with relations
   *
   * @param uid - Shop ID
   * @returns Promise resolving to the shop with business_type and services
   * @throws {APIError} 404 NOT_FOUND if shop doesn't exist
   */
  public async findById(uid: string): Promise<PBTypes.partner.entities.Shop> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const shop = await em.findOne(models.Shop, {
          where: { uid },
          relations: ["business_type", "services"],
        });

        if (!shop) {
          throw new errors.APIError(404, "NOT_FOUND", "Shop not found");
        }

        return {
          ...shop,
          business_type: shop.business_type
            ? {
                uid: shop.business_type.uid,
                name: shop.business_type.name,
                description: shop.business_type.description,
              }
            : null,
        };
      }
    );
    return response as PBTypes.partner.entities.Shop;
  }

  /**
   * Get All Shops - Retrieve all shops with pagination
   *
   * @param limit - Number of items to return (default: 20)
   * @param offset - Number of items to skip (default: 0)
   * @param partner_uid - Optional: Filter by partner UID
   * @returns Promise resolving to array of shops
   */
  public async findAllByPartner(
    partner_uid: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<PBTypes.partner.entities.Shop[]> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        // check if partner_uid is provided
        if (partner_uid == undefined || partner_uid.trim() === "") {
          throw new errors.APIError(400, "BAD_REQUEST", "partner_uid missing");
        }
        // check the partner id from external uid
        const partner = await em.findOne(models.Partner, {
          where: { external_uid: partner_uid },
        });
        if (!partner) {
          throw new errors.APIError(400, "BAD_REQUEST", "Invalid partner UID");
        }
        const response = await em.find(models.Shop, {
          where: { partner_uid: partner.uid },
          relations: ["business_type"],
        });

        return response;
      }
    );
    return response as PBTypes.partner.entities.Shop[];
  }

  /**
   * Update Shop - Update shop information
   *
   * @param uid - Shop ID
   * @param data - Fields to update
   * @returns Promise resolving to updated shop
   * @throws {APIError} 404 NOT_FOUND if shop doesn't exist
   */
  public async update(
    uid: string,
    data: Partial<UpdateShopRequest>
  ): Promise<PBTypes.partner.entities.Shop> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const shop = await em.findOne(models.Shop, {
          where: { uid },
          relations: ["business_type"],
        });
        if (!shop) {
          throw new errors.APIError(404, "NOT_FOUND", "Shop not found");
        }
        // load business_type relation
        const business_type = await em.findOne(models.BusinessType, {
          where: { uid: data.business_type },
        });

        // Update shop
        Object.assign(shop, data, { business_type });
        await em.save(shop);

        return shop;
      }
    );
    return response as PBTypes.partner.entities.Shop;
  }

  /**
   * Delete Shop - Soft delete a shop by setting status to INACTIVE
   *
   * @param uid - Shop ID
   * @returns Promise resolving to true if successful
   * @throws {APIError} 404 NOT_FOUND if shop doesn't exist
   */
  public async delete(uid: string): Promise<boolean> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const shop = await em.findOne(models.Shop, { where: { uid } });
        if (!shop) {
          throw new errors.APIError(404, "NOT_FOUND", "Shop not found");
        }

        // Soft delete - set status to inactive
        shop.status = enums.ShopStatus.DELETED;
        await em.save(shop);
        return true;
      }
    );
    return response as boolean;
  }

  /**
   * Enable Shop - Set shop status to ONLINE
   *
   * @param uid - Shop ID
   * @returns Promise resolving to the updated shop
   * @throws {APIError} 404 NOT_FOUND if shop doesn't exist
   */
  public async enable(uid: string): Promise<PBTypes.partner.entities.Shop> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const shop = await em.findOne(models.Shop, {
          where: { uid },
          relations: ["business_type"],
        });
        if (!shop) {
          throw new errors.APIError(404, "NOT_FOUND", "Shop not found");
        }

        shop.status = enums.ShopStatus.ONLINE;
        await em.save(shop);
        return shop;
      }
    );
    return response as PBTypes.partner.entities.Shop;
  }

  /**
   * Disable Shop - Set shop status to OFFLINE
   *
   * @param uid - Shop ID
   * @returns Promise resolving to the updated shop
   * @throws {APIError} 404 NOT_FOUND if shop doesn't exist
   */
  public async disable(uid: string): Promise<PBTypes.partner.entities.Shop> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const shop = await em.findOne(models.Shop, {
          where: { uid },
          relations: ["business_type"],
        });
        if (!shop) {
          throw new errors.APIError(404, "NOT_FOUND", "Shop not found");
        }

        shop.status = enums.ShopStatus.OFFLINE;
        await em.save(shop);
        return shop;
      }
    );
    return response as PBTypes.partner.entities.Shop;
  }
}
