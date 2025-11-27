import { injectable, inject, LazyServiceIdentifier } from "inversify";
import { EntityManager } from "typeorm";
import {
  errors,
  INVERSITY_TYPES,
  IPersistenceContext,
} from "@giusmento/mangojs-core";
import * as models from "../db/models";
import {
  CreateCompanyMediaRequest,
  UpdateCompanyMediaRequest,
} from "../types/types";

@injectable()
export class CompanyMediaService {
  @inject(new LazyServiceIdentifier(() => INVERSITY_TYPES.PersistenceContext))
  private _persistenceContext: IPersistenceContext;

  constructor() {}

  /**
   * Create Company Media - Create a new company media with validation
   *
   * @param data - Company media creation data
   * @returns Promise resolving to the created company media
   * @throws {APIError} 400 BAD_REQUEST if partner_id, url, or type is missing
   */
  public async create(data: CreateCompanyMediaRequest): Promise<models.CompanyMedia> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        // Validation
        if (!data.partnerId) {
          throw new errors.APIError(400, "BAD_REQUEST", "Partner ID is required");
        }
        if (!data.url) {
          throw new errors.APIError(400, "BAD_REQUEST", "URL is required");
        }
        if (!data.type) {
          throw new errors.APIError(400, "BAD_REQUEST", "Media type is required");
        }

        // Create and save using em
        const media = em.create(models.CompanyMedia, {
          ...data,
          type: data.type as models.MediaType,
        });
        await em.save(media);
        return media;
      }
    );
    return response as models.CompanyMedia;
  }

  /**
   * Get Company Media By ID - Retrieve a company media by their ID with relations
   *
   * @param uid - Company media ID
   * @returns Promise resolving to the company media with partner
   * @throws {APIError} 404 NOT_FOUND if company media doesn't exist
   */
  public async findById(uid: string): Promise<models.CompanyMedia> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const media = await em.findOne(models.CompanyMedia, {
          where: { uid },
          relations: ["partner"],
        });

        if (!media) {
          throw new errors.APIError(404, "NOT_FOUND", "Company media not found");
        }

        return media;
      }
    );
    return response as models.CompanyMedia;
  }

  /**
   * Get All Company Media - Retrieve all company media with optional filtering
   *
   * @param partner_id - Optional partner ID to filter by
   * @param type - Optional media type to filter by
   * @param limit - Number of items to return (default: 20)
   * @param offset - Number of items to skip (default: 0)
   * @returns Promise resolving to array of company media ordered by display_order
   */
  public async findAll(
    partner_id?: string,
    type?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<models.CompanyMedia[]> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const query = em
          .createQueryBuilder(models.CompanyMedia, "media")
          .leftJoinAndSelect("media.partner", "partner")
          .orderBy("media.displayOrder", "ASC");

        if (partner_id) {
          query.where("media.partnerId = :partnerId", { partnerId: partner_id });
        }

        if (type) {
          query.andWhere("media.type = :type", { type });
        }

        query.take(limit).skip(offset);

        return await query.getMany();
      }
    );
    return response as models.CompanyMedia[];
  }

  /**
   * Update Company Media - Update company media information
   *
   * @param uid - Company media ID
   * @param data - Fields to update
   * @returns Promise resolving to updated company media
   * @throws {APIError} 404 NOT_FOUND if company media doesn't exist
   */
  public async update(
    uid: string,
    data: UpdateCompanyMediaRequest
  ): Promise<models.CompanyMedia> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const media = await em.findOne(models.CompanyMedia, { where: { uid } });
        if (!media) {
          throw new errors.APIError(404, "NOT_FOUND", "Company media not found");
        }

        Object.assign(media, data);
        await em.save(media);
        return media;
      }
    );
    return response as models.CompanyMedia;
  }

  /**
   * Delete Company Media - Remove a company media (hard delete)
   *
   * @param uid - Company media ID
   * @returns Promise resolving to true if successful
   * @throws {APIError} 404 NOT_FOUND if company media doesn't exist
   */
  public async delete(uid: string): Promise<boolean> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const media = await em.findOne(models.CompanyMedia, { where: { uid } });
        if (!media) {
          throw new errors.APIError(404, "NOT_FOUND", "Company media not found");
        }

        await em.remove(media);
        return true;
      }
    );
    return response as boolean;
  }
}
