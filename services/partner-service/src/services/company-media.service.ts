import { injectable } from "inversify";
import { EntityManager } from "typeorm";
import { errors } from "@giusmento/mangojs-core";
import * as models from "../db/models";
import { AppDataSource } from "../data-source";
import {
  CreateCompanyMediaRequest,
  UpdateCompanyMediaRequest,
} from "../types/types";

@injectable()
export class CompanyMediaService {
  constructor() {}


  async create(data: CreateCompanyMediaRequest): Promise<models.CompanyMedia> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        // Validation
        if (!data.partner_id) {
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
    return response;
  }

  async findById(uid: string): Promise<models.CompanyMedia> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
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
    return response;
  }

  async findAll(
    partner_id?: string,
    type?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<models.CompanyMedia[]> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        const query = em
          .createQueryBuilder(models.CompanyMedia, "media")
          .leftJoinAndSelect("media.partner", "partner")
          .orderBy("media.display_order", "ASC");

        if (partner_id) {
          query.where("media.partner_id = :partner_id", { partner_id });
        }

        if (type) {
          query.andWhere("media.type = :type", { type });
        }

        query.take(limit).skip(offset);

        return await query.getMany();
      }
    );
    return response;
  }

  async update(
    uid: string,
    data: UpdateCompanyMediaRequest
  ): Promise<models.CompanyMedia> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        const media = await em.findOne(models.CompanyMedia, { where: { uid } });
        if (!media) {
          throw new errors.APIError(404, "NOT_FOUND", "Company media not found");
        }

        Object.assign(media, data);
        await em.save(media);
        return media;
      }
    );
    return response;
  }

  async delete(uid: string): Promise<boolean> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        const media = await em.findOne(models.CompanyMedia, { where: { uid } });
        if (!media) {
          throw new errors.APIError(404, "NOT_FOUND", "Company media not found");
        }

        await em.remove(media);
        return true;
      }
    );
    return response;
  }
}
