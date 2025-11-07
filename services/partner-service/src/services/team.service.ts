import { injectable } from "inversify";
import { EntityManager } from "typeorm";
import { errors } from "@giusmento/mangojs-core";
import * as models from "../db/models";
import { AppDataSource } from "../data-source";
import { CreateTeamRequest, UpdateTeamRequest } from "../types/types";

@injectable()
export class TeamService {
  constructor() {}


  async create(data: CreateTeamRequest): Promise<models.Team> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        // Validation
        if (!data.name) {
          throw new errors.APIError(400, "BAD_REQUEST", "Team name is required");
        }
        if (!data.partner_id) {
          throw new errors.APIError(400, "BAD_REQUEST", "Partner ID is required");
        }

        // Create and save using em
        const team = em.create(models.Team, data);
        await em.save(team);
        return team;
      }
    );
    return response;
  }

  async findById(uid: string): Promise<models.Team> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        const team = await em.findOne(models.Team, {
          where: { uid },
          relations: ["partner", "members", "teamServices", "teamServices.service"],
        });

        if (!team) {
          throw new errors.APIError(404, "NOT_FOUND", "Team not found");
        }

        return team;
      }
    );
    return response;
  }

  async findAll(
    partner_id?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<models.Team[]> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        const query = em
          .createQueryBuilder(models.Team, "team")
          .leftJoinAndSelect("team.partner", "partner")
          .leftJoinAndSelect("team.members", "members")
          .leftJoinAndSelect("team.teamServices", "teamServices")
          .leftJoinAndSelect("teamServices.service", "service");

        if (partner_id) {
          query.where("team.partner_id = :partner_id", { partner_id });
        }

        query.take(limit).skip(offset);

        return await query.getMany();
      }
    );
    return response;
  }

  async update(uid: string, data: UpdateTeamRequest): Promise<models.Team> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        const team = await em.findOne(models.Team, { where: { uid } });
        if (!team) {
          throw new errors.APIError(404, "NOT_FOUND", "Team not found");
        }

        Object.assign(team, data);
        await em.save(team);
        return team;
      }
    );
    return response;
  }

  async delete(uid: string): Promise<boolean> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        const team = await em.findOne(models.Team, { where: { uid } });
        if (!team) {
          throw new errors.APIError(404, "NOT_FOUND", "Team not found");
        }

        await em.remove(team);
        return true;
      }
    );
    return response;
  }
}
