import { injectable, inject, LazyServiceIdentifier } from "inversify";
import { EntityManager } from "typeorm";
import {
  errors,
  INVERSITY_TYPES,
  IPersistenceContext,
} from "@giusmento/mangojs-core";
import * as models from "../db/models";
import { CreateServiceRequest, UpdateServiceRequest } from "../types/types";

@injectable()
export class ServiceService {
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
  public async create(data: CreateServiceRequest): Promise<models.Service> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        // Validation
        if (!data.name) {
          throw new errors.APIError(400, "BAD_REQUEST", "Service name is required");
        }
        if (!data.partner_id) {
          throw new errors.APIError(400, "BAD_REQUEST", "Partner ID is required");
        }
        if (!data.duration_minutes || data.duration_minutes <= 0) {
          throw new errors.APIError(400, "BAD_REQUEST", "Valid duration is required");
        }
        if (!data.price || data.price < 0) {
          throw new errors.APIError(400, "BAD_REQUEST", "Valid price is required");
        }

        // Create and save using em
        const service = em.create(models.Service, data);
        await em.save(service);
        return service;
      }
    );
    return response as models.Service;
  }

  /**
   * Get Service By ID - Retrieve a service by their ID with relations
   *
   * @param uid - Service ID
   * @returns Promise resolving to the service with partner and teams
   * @throws {APIError} 404 NOT_FOUND if service doesn't exist
   */
  public async findById(uid: string): Promise<models.Service> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const service = await em.findOne(models.Service, {
          where: { uid },
          relations: ["partner", "teamServices", "teamServices.team"],
        });

        if (!service) {
          throw new errors.APIError(404, "NOT_FOUND", "Service not found");
        }

        return service;
      }
    );
    return response as models.Service;
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
  ): Promise<models.Service[]> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const query = em
          .createQueryBuilder(models.Service, "service")
          .leftJoinAndSelect("service.partner", "partner")
          .leftJoinAndSelect("service.teamServices", "teamServices")
          .leftJoinAndSelect("teamServices.team", "team");

        if (partner_id) {
          query.where("service.partner_id = :partner_id", { partner_id });
        }

        query.take(limit).skip(offset);

        return await query.getMany();
      }
    );
    return response as models.Service[];
  }

  /**
   * Update Service - Update service information
   *
   * @param uid - Service ID
   * @param data - Fields to update
   * @returns Promise resolving to updated service
   * @throws {APIError} 404 NOT_FOUND if service doesn't exist
   */
  public async update(uid: string, data: UpdateServiceRequest): Promise<models.Service> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const service = await em.findOne(models.Service, { where: { uid } });
        if (!service) {
          throw new errors.APIError(404, "NOT_FOUND", "Service not found");
        }

        Object.assign(service, data);
        await em.save(service);
        return service;
      }
    );
    return response as models.Service;
  }

  /**
   * Delete Service - Remove a service (hard delete)
   *
   * @param uid - Service ID
   * @returns Promise resolving to true if successful
   * @throws {APIError} 404 NOT_FOUND if service doesn't exist
   */
  public async delete(uid: string): Promise<boolean> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const service = await em.findOne(models.Service, { where: { uid } });
        if (!service) {
          throw new errors.APIError(404, "NOT_FOUND", "Service not found");
        }

        await em.remove(service);
        return true;
      }
    );
    return response as boolean;
  }
}
