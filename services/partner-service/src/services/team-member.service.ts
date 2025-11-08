import { injectable, inject, LazyServiceIdentifier } from "inversify";
import { EntityManager } from "typeorm";
import {
  errors,
  INVERSITY_TYPES,
  IPersistenceContext,
} from "@giusmento/mangojs-core";
import * as models from "../db/models";
import { CreateTeamMemberRequest } from "../types/types";

@injectable()
export class TeamMemberService {
  @inject(new LazyServiceIdentifier(() => INVERSITY_TYPES.PersistenceContext))
  private _persistenceContext: IPersistenceContext;

  constructor() {}

  /**
   * Create Team Member - Create a new team member with validation
   *
   * @param data - Team member creation data
   * @returns Promise resolving to the created team member
   * @throws {APIError} 400 BAD_REQUEST if team_id or user_id is missing
   */
  public async create(data: CreateTeamMemberRequest): Promise<models.TeamMember> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        // Validation
        if (!data.team_id) {
          throw new errors.APIError(400, "BAD_REQUEST", "Team ID is required");
        }
        if (!data.user_id) {
          throw new errors.APIError(400, "BAD_REQUEST", "User ID is required");
        }

        // Create and save using em
        const teamMember = em.create(models.TeamMember, data);
        await em.save(teamMember);
        return teamMember;
      }
    );
    return response as models.TeamMember;
  }

  /**
   * Get Team Member By ID - Retrieve a team member by their ID with relations
   *
   * @param uid - Team member ID
   * @returns Promise resolving to the team member with team, partner, appointments, and availabilities
   * @throws {APIError} 404 NOT_FOUND if team member doesn't exist
   */
  public async findById(uid: string): Promise<models.TeamMember> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const teamMember = await em.findOne(models.TeamMember, {
          where: { uid },
          relations: ["team", "team.partner", "appointments", "availabilities"],
        });

        if (!teamMember) {
          throw new errors.APIError(404, "NOT_FOUND", "Team member not found");
        }

        return teamMember;
      }
    );
    return response as models.TeamMember;
  }

  /**
   * Get All Team Members - Retrieve all team members with optional filtering by team
   *
   * @param team_id - Optional team ID to filter by
   * @param limit - Number of items to return (default: 20)
   * @param offset - Number of items to skip (default: 0)
   * @returns Promise resolving to array of team members
   */
  public async findAll(
    team_id?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<models.TeamMember[]> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const query = em
          .createQueryBuilder(models.TeamMember, "teamMember")
          .leftJoinAndSelect("teamMember.team", "team")
          .leftJoinAndSelect("team.partner", "partner");

        if (team_id) {
          query.where("teamMember.team_id = :team_id", { team_id });
        }

        query.take(limit).skip(offset);

        return await query.getMany();
      }
    );
    return response as models.TeamMember[];
  }

  /**
   * Delete Team Member - Remove a team member (hard delete)
   *
   * @param uid - Team member ID
   * @returns Promise resolving to true if successful
   * @throws {APIError} 404 NOT_FOUND if team member doesn't exist
   */
  public async delete(uid: string): Promise<boolean> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const teamMember = await em.findOne(models.TeamMember, { where: { uid } });
        if (!teamMember) {
          throw new errors.APIError(404, "NOT_FOUND", "Team member not found");
        }

        await em.remove(teamMember);
        return true;
      }
    );
    return response as boolean;
  }

  /**
   * Get Upcoming Appointments - Get all upcoming appointments for a team member
   *
   * @param uid - Team member ID
   * @returns Promise resolving to team member's upcoming appointments sorted by date
   * @throws {APIError} 404 NOT_FOUND if team member doesn't exist
   */
  public async getUpcomingAppointments(uid: string): Promise<any> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const teamMember = await em.findOne(models.TeamMember, {
          where: { uid },
          relations: ["appointments", "appointments.service"],
        });

        if (!teamMember) {
          throw new errors.APIError(404, "NOT_FOUND", "Team member not found");
        }

        const now = new Date();
        const upcoming = teamMember.appointments.filter((apt) => {
          const aptDate = new Date(apt.appointment_date);
          return aptDate >= now;
        });

        return {
          team_member_uid: teamMember.uid,
          user_id: teamMember.user_id,
          upcoming_appointments: upcoming.sort(
            (a, b) =>
              new Date(a.appointment_date).getTime() -
              new Date(b.appointment_date).getTime()
          ),
        };
      }
    );
    return response;
  }
}
