import { injectable } from "inversify";
import { EntityManager } from "typeorm";
import { errors } from "@giusmento/mangojs-core";
import * as models from "../db/models";
import { AppDataSource } from "../data-source";
import { CreateTeamServiceRequest } from "../types/types";

@injectable()
export class TeamServiceService {
  constructor() {}


  async create(data: CreateTeamServiceRequest): Promise<models.TeamService> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        // Validation
        if (!data.team_id) {
          throw new errors.APIError(400, "BAD_REQUEST", "Team ID is required");
        }
        if (!data.service_id) {
          throw new errors.APIError(400, "BAD_REQUEST", "Service ID is required");
        }

        // Create and save using em
        const teamService = em.create(models.TeamService, data);
        await em.save(teamService);
        return teamService;
      }
    );
    return response;
  }

  async findById(uid: string): Promise<models.TeamService> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        const teamService = await em.findOne(models.TeamService, {
          where: { uid },
          relations: ["team", "service"],
        });

        if (!teamService) {
          throw new errors.APIError(404, "NOT_FOUND", "Team service not found");
        }

        return teamService;
      }
    );
    return response;
  }

  async findAll(
    team_id?: string,
    service_id?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<models.TeamService[]> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        const query = em
          .createQueryBuilder(models.TeamService, "teamService")
          .leftJoinAndSelect("teamService.team", "team")
          .leftJoinAndSelect("teamService.service", "service");

        if (team_id) {
          query.andWhere("teamService.team_id = :team_id", { team_id });
        }

        if (service_id) {
          query.andWhere("teamService.service_id = :service_id", { service_id });
        }

        query.take(limit).skip(offset);

        return await query.getMany();
      }
    );
    return response;
  }

  async delete(uid: string): Promise<boolean> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        const teamService = await em.findOne(models.TeamService, { where: { uid } });
        if (!teamService) {
          throw new errors.APIError(404, "NOT_FOUND", "Team service not found");
        }

        await em.remove(teamService);
        return true;
      }
    );
    return response;
  }
}
