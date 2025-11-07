import { injectable } from "inversify";
import { EntityManager } from "typeorm";
import { errors } from "@giusmento/mangojs-core";
import * as models from "../db/models";
import {
  CreatePartnerRequest,
  UpdatePartnerRequest,
  SearchPartnersRequest,
} from "../types/types";
import { AppDataSource } from "../data-source";

@injectable()
export class PartnerService {
  constructor() {}

  async create(data: CreatePartnerRequest): Promise<models.Partner> {
    return await AppDataSource.transaction(async (em: EntityManager) => {
      // Validation
      if (!data.company_name) {
        throw new errors.APIError(400, "BAD_REQUEST", "Company name is required");
      }
      if (!data.owner_user_id) {
        throw new errors.APIError(400, "BAD_REQUEST", "Owner user ID is required");
      }

      // Create and save using em
      const partner = em.create(models.Partner, data);
      await em.save(partner);
      return partner;
    });
  }

  async findById(uid: string): Promise<models.Partner> {
    return await AppDataSource.transaction(async (em: EntityManager) => {
      const partner = await em.findOne(models.Partner, {
        where: { uid },
        relations: ["teams", "services", "media"],
      });

      if (!partner) {
        throw new errors.APIError(404, "NOT_FOUND", "Partner not found");
      }

      return partner;
    });
  }

  async findAll(limit: number = 20, offset: number = 0): Promise<models.Partner[]> {
    return await AppDataSource.transaction(async (em: EntityManager) => {
      return await em.find(models.Partner, {
        take: limit,
        skip: offset,
        relations: ["teams", "services", "media"],
      });
    });
  }

  async update(uid: string, data: UpdatePartnerRequest): Promise<models.Partner> {
    return await AppDataSource.transaction(async (em: EntityManager) => {
      const partner = await em.findOne(models.Partner, { where: { uid } });
      if (!partner) {
        throw new errors.APIError(404, "NOT_FOUND", "Partner not found");
      }

      Object.assign(partner, data);
      await em.save(partner);
      return partner;
    });
  }

  async delete(uid: string): Promise<boolean> {
    return await AppDataSource.transaction(async (em: EntityManager) => {
      const partner = await em.findOne(models.Partner, { where: { uid } });
      if (!partner) {
        throw new errors.APIError(404, "NOT_FOUND", "Partner not found");
      }

      // Soft delete - set status to inactive
      partner.status = models.PartnerStatus.INACTIVE;
      await em.save(partner);
      return true;
    });
  }

  async search(params: SearchPartnersRequest): Promise<models.Partner[]> {
    return await AppDataSource.transaction(async (em: EntityManager) => {
      const query = em
        .createQueryBuilder(models.Partner, "partner")
        .leftJoinAndSelect("partner.services", "service")
        .leftJoinAndSelect("partner.media", "media")
        .where("partner.status = :status", { status: models.PartnerStatus.ACTIVE });

      if (params.city) {
        query.andWhere("LOWER(partner.city) = LOWER(:city)", {
          city: params.city,
        });
      }

      if (params.service_id) {
        query.andWhere("service.uid = :serviceId", {
          serviceId: params.service_id,
        });
      }

      // Location-based search
      if (params.latitude && params.longitude && params.radius) {
        const { latitude, longitude, radius } = params;
        // Haversine formula for distance calculation
        query.andWhere(
          `(
            6371 * acos(
              cos(radians(:lat)) * cos(radians(partner.latitude)) *
              cos(radians(partner.longitude) - radians(:lon)) +
              sin(radians(:lat)) * sin(radians(partner.latitude))
            )
          ) <= :radius`,
          { lat: latitude, lon: longitude, radius }
        );
      }

      query.take(params.limit || 20).skip(params.offset || 0);

      return await query.getMany();
    });
  }

  async getAvailability(partnerUid: string): Promise<any> {
    return await AppDataSource.transaction(async (em: EntityManager) => {
      const partner = await em.findOne(models.Partner, {
        where: { uid: partnerUid },
        relations: [
          "teams",
          "teams.members",
          "teams.members.availabilities",
          "teams.teamServices",
          "teams.teamServices.service",
        ],
      });

      if (!partner) {
        throw new errors.APIError(404, "NOT_FOUND", "Partner not found");
      }

      // Structure the availability data
      return {
        partner: {
          uid: partner.uid,
          company_name: partner.company_name,
        },
        teams: partner.teams.map((team) => ({
          uid: team.uid,
          name: team.name,
          services: team.teamServices.map((ts) => ts.service),
          members: team.members.map((member) => ({
            uid: member.uid,
            user_id: member.user_id,
            role: member.role,
            availabilities: member.availabilities,
          })),
        })),
      };
    });
  }
}
