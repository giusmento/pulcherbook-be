import { injectable } from "inversify";
import { EntityManager } from "typeorm";
import { errors } from "@giusmento/mangojs-core";
import * as models from "../db/models";
import { AppDataSource } from "../data-source";
import { CreateTeamMemberRequest } from "../types/types";

@injectable()
export class TeamMemberService {
  constructor() {}


  async create(data: CreateTeamMemberRequest): Promise<models.TeamMember> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
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
    return response;
  }

  async findById(uid: string): Promise<models.TeamMember> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
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
    return response;
  }

  async findAll(
    team_id?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<models.TeamMember[]> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
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
    return response;
  }

  async delete(uid: string): Promise<boolean> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        const teamMember = await em.findOne(models.TeamMember, { where: { uid } });
        if (!teamMember) {
          throw new errors.APIError(404, "NOT_FOUND", "Team member not found");
        }

        await em.remove(teamMember);
        return true;
      }
    );
    return response;
  }

  async getUpcomingAppointments(uid: string): Promise<any> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
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
