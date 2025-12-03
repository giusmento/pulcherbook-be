import { injectable, inject, LazyServiceIdentifier } from "inversify";
import { EntityManager, In } from "typeorm";
import {
  errors,
  INVERSITY_TYPES,
  IPersistenceContext,
} from "@giusmento/mangojs-core";
import * as models from "../db/models";
import type * as PBTypes from "@giusmento/pulcherbook-types";

// Import service layer request types from shared package
type CreateServiceRequest = PBTypes.partner.entities.OfferingPost;
type UpdateServiceRequest = PBTypes.partner.entities.OfferingPut;

@injectable()
export class OfferingService {
  @inject(new LazyServiceIdentifier(() => INVERSITY_TYPES.PersistenceContext))
  private _persistenceContext: IPersistenceContext;

  constructor() {}

  /**
   * Create Service - Create a new service with validation
   *
   * @param data - Service creation data
   * @returns Promise resolving to the created service
   * @throws {APIError} 400 BAD_REQUEST if validation fails
   */
  public async create(data: CreateServiceRequest): Promise<models.Offering> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        // Validation
        if (!data.name) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "Service name is required"
          );
        }
        if (!data.partnerUId) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "Partner ID is required"
          );
        }
        if (!data.durationMinutes || data.durationMinutes <= 0) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "Valid duration is required"
          );
        }
        if (!data.price || data.price < 0) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "Valid price is required"
          );
        }
        // append shops
        const shops = await em.find(models.Shop, {
          where: { uid: In(data.shops || []) },
        });
        // append teams
        const teams = await em.find(models.Team, {
          where: { uid: In(data.teams || []) },
        });

        const createOfferingObject = Object.assign(data, { shops, teams });
        // Create and save using em
        const offering = em.create(models.Offering, createOfferingObject);
        await em.save(offering);
        return offering;
      }
    );
    return response as models.Offering;
  }

  /**
   * Get Service By ID - Retrieve a service by their ID with relations
   *
   * @param uid - Service ID
   * @returns Promise resolving to the service with partner and teams
   * @throws {APIError} 404 NOT_FOUND if service doesn't exist
   */
  public async findById(uid: string): Promise<models.Offering> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const offering = await em.findOne(models.Offering, {
          where: { uid },
          relations: ["partner", "teamServices", "teamServices.team"],
        });

        if (!offering) {
          throw new errors.APIError(404, "NOT_FOUND", "Service not found");
        }

        return offering;
      }
    );
    return response as models.Offering;
  }

  /**
   * Get All Services - Retrieve all services with optional filtering by partner
   *
   * @param partner_id - Optional partner ID to filter by
   * @param limit - Number of items to return (default: 20)
   * @param offset - Number of items to skip (default: 0)
   * @returns Promise resolving to array of services
   */
  public async findAll(
    partner_id?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<models.Offering[]> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        // If no partner_id, return error
        if (!partner_id) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "Partner ID is required"
          );
        }

        const offerings = await em.find(models.Offering, {
          where: { partnerUid: partner_id },
          relations: ["teams", "shops"],
          take: limit,
          skip: offset,
        });

        return offerings;
      }
    );
    return response as models.Offering[];
  }

  /**
   * Update Service - Update service information
   *
   * @param uid - Service ID
   * @param data - Fields to update
   * @returns Promise resolving to updated service
   * @throws {APIError} 404 NOT_FOUND if service doesn't exist
   */
  public async update(
    uid: string,
    data: UpdateServiceRequest
  ): Promise<models.Offering> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const offering = await em.findOne(models.Offering, { where: { uid } });
        if (!offering) {
          throw new errors.APIError(404, "NOT_FOUND", "Service not found");
        }

        Object.assign(offering, data);
        await em.save(offering);
        return offering;
      }
    );
    return response as models.Offering;
  }

  /**
   * Delete Offering - Remove a service (hard delete)
   *
   * @param uid - Service ID
   * @returns Promise resolving to true if successful
   * @throws {APIError} 404 NOT_FOUND if service doesn't exist
   */
  public async delete(uid: string): Promise<boolean> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const offering = await em.findOne(models.Offering, { where: { uid } });
        if (!offering) {
          throw new errors.APIError(404, "NOT_FOUND", "Service not found");
        }

        await em.remove(offering);
        return true;
      }
    );
    return response as boolean;
  }
}
