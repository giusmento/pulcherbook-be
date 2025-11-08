import { injectable, inject, LazyServiceIdentifier } from "inversify";
import { EntityManager } from "typeorm";
import {
  errors,
  INVERSITY_TYPES,
  IPersistenceContext,
} from "@giusmento/mangojs-core";
import * as models from "../db/models";
import { CreateTeamServiceRequest } from "../types/types";

@injectable()
export class TeamServiceService {
  @inject(new LazyServiceIdentifier(() => INVERSITY_TYPES.PersistenceContext))
  private _persistenceContext: IPersistenceContext;

  constructor() {}

  /**
   * Create Team Service - Create a new team-service association with validation
   *
   * @param data - Team service creation data
   * @returns Promise resolving to the created team service
   * @throws {APIError} 400 BAD_REQUEST if team_id or service_id is missing
   */
  public async create(data: CreateTeamServiceRequest): Promise<models.TeamService> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
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
    return response as models.TeamService;
  }

  /**
   * Get Team Service By ID - Retrieve a team service by their ID with relations
   *
   * @param uid - Team service ID
   * @returns Promise resolving to the team service with team and service
   * @throws {APIError} 404 NOT_FOUND if team service doesn't exist
   */
  public async findById(uid: string): Promise<models.TeamService> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
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
    return response as models.TeamService;
  }

  /**
   * Get All Team Services - Retrieve all team services with optional filtering
   *
   * @param team_id - Optional team ID to filter by
   * @param service_id - Optional service ID to filter by
   * @param limit - Number of items to return (default: 20)
   * @param offset - Number of items to skip (default: 0)
   * @returns Promise resolving to array of team services
   */
  public async findAll(
    team_id?: string,
    service_id?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<models.TeamService[]> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
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
    return response as models.TeamService[];
  }

  /**
   * Delete Team Service - Remove a team service association (hard delete)
   *
   * @param uid - Team service ID
   * @returns Promise resolving to true if successful
   * @throws {APIError} 404 NOT_FOUND if team service doesn't exist
   */
  public async delete(uid: string): Promise<boolean> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const teamService = await em.findOne(models.TeamService, { where: { uid } });
        if (!teamService) {
          throw new errors.APIError(404, "NOT_FOUND", "Team service not found");
        }

        await em.remove(teamService);
        return true;
      }
    );
    return response as boolean;
  }
}
