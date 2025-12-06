import { injectable, inject, LazyServiceIdentifier } from "inversify";
import { EntityManager } from "typeorm";
import {
  INVERSITY_TYPES,
  IPersistenceContext,
} from "@giusmento/mangojs-core";
import * as models from "../db/models";

@injectable()
export class CatalogService {
  @inject(new LazyServiceIdentifier(() => INVERSITY_TYPES.PersistenceContext))
  private _persistenceContext: IPersistenceContext;

  constructor() {}

  /**
   * Get all active business types
   * @returns Array of business types from database
   */
  public async getBusinessTypes(): Promise<models.BusinessType[]> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const businessTypes = await em.find(models.BusinessType, {
          where: { status: models.BusinessTypeStatus.ACTIVE },
          order: { name: "ASC" },
        });
        return businessTypes;
      }
    );
    return response as models.BusinessType[];
  }

  /**
   * Get all active offering categories
   * @returns Array of offering categories from database
   */
  public async getOfferingCategories(): Promise<models.OfferingCategory[]> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const offeringCategories = await em.find(models.OfferingCategory, {
          where: { isActive: true, deletedAt: null },
          order: { name: "ASC" },
        });
        return offeringCategories;
      }
    );
    return response as models.OfferingCategory[];
  }
}
