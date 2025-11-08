import { injectable, inject, LazyServiceIdentifier } from "inversify";
import { EntityManager } from "typeorm";
import {
  errors,
  INVERSITY_TYPES,
  IPersistenceContext,
} from "@giusmento/mangojs-core";
import * as models from "../db/models";
import { CreateTeamRequest, UpdateTeamRequest } from "../types/types";

@injectable()
export class TeamService {
  @inject(new LazyServiceIdentifier(() => INVERSITY_TYPES.PersistenceContext))
  private _persistenceContext: IPersistenceContext;

  constructor() {}

  /**
   * Create Team - Create a new team with validation
   *
   * @param data - Team creation data
   * @returns Promise resolving to the created team
   * @throws {APIError} 400 BAD_REQUEST if name or partner_id is missing
   */
  public async create(data: CreateTeamRequest): Promise<models.Team> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
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
    return response as models.Team;
  }

  /**
   * Get Team By ID - Retrieve a team by their ID with relations
   *
   * @param uid - Team ID
   * @returns Promise resolving to the team with partner, members, and services
   * @throws {APIError} 404 NOT_FOUND if team doesn't exist
   */
  public async findById(uid: string): Promise<models.Team> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
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
    return response as models.Team;
  }

  /**
   * Get All Teams - Retrieve all teams with optional filtering by partner
   *
   * @param partner_id - Optional partner ID to filter by
   * @param limit - Number of items to return (default: 20)
   * @param offset - Number of items to skip (default: 0)
   * @returns Promise resolving to array of teams
   */
  public async findAll(
    partner_id?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<models.Team[]> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
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
    return response as models.Team[];
  }

  /**
   * Update Team - Update team information
   *
   * @param uid - Team ID
   * @param data - Fields to update
   * @returns Promise resolving to updated team
   * @throws {APIError} 404 NOT_FOUND if team doesn't exist
   */
  public async update(uid: string, data: UpdateTeamRequest): Promise<models.Team> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const team = await em.findOne(models.Team, { where: { uid } });
        if (!team) {
          throw new errors.APIError(404, "NOT_FOUND", "Team not found");
        }

        Object.assign(team, data);
        await em.save(team);
        return team;
      }
    );
    return response as models.Team;
  }

  /**
   * Delete Team - Remove a team (hard delete)
   *
   * @param uid - Team ID
   * @returns Promise resolving to true if successful
   * @throws {APIError} 404 NOT_FOUND if team doesn't exist
   */
  public async delete(uid: string): Promise<boolean> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const team = await em.findOne(models.Team, { where: { uid } });
        if (!team) {
          throw new errors.APIError(404, "NOT_FOUND", "Team not found");
        }

        await em.remove(team);
        return true;
      }
    );
    return response as boolean;
  }
}
