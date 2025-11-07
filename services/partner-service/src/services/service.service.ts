import { injectable } from "inversify";
import { EntityManager } from "typeorm";
import { errors } from "@giusmento/mangojs-core";
import * as models from "../db/models";
import { AppDataSource } from "../data-source";
import { CreateServiceRequest, UpdateServiceRequest } from "../types/types";

@injectable()
export class ServiceService {
  constructor() {}


  async create(data: CreateServiceRequest): Promise<models.Service> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
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
    return response;
  }

  async findById(uid: string): Promise<models.Service> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
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
    return response;
  }

  async findAll(
    partner_id?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<models.Service[]> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
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
    return response;
  }

  async update(uid: string, data: UpdateServiceRequest): Promise<models.Service> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        const service = await em.findOne(models.Service, { where: { uid } });
        if (!service) {
          throw new errors.APIError(404, "NOT_FOUND", "Service not found");
        }

        Object.assign(service, data);
        await em.save(service);
        return service;
      }
    );
    return response;
  }

  async delete(uid: string): Promise<boolean> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        const service = await em.findOne(models.Service, { where: { uid } });
        if (!service) {
          throw new errors.APIError(404, "NOT_FOUND", "Service not found");
        }

        await em.remove(service);
        return true;
      }
    );
    return response;
  }
}
