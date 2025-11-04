import { injectable } from "inversify";
import { Repository } from "typeorm";
import { TeamMember } from "../db/models";
import { CreateTeamMemberRequest } from "../types/types";
import { AppDataSource } from "../data-source";

@injectable()
export class TeamMemberService {
  private teamMemberRepository: Repository<TeamMember>;

  constructor() {
    this.teamMemberRepository = AppDataSource.getRepository(TeamMember);
  }

  async create(data: CreateTeamMemberRequest): Promise<TeamMember> {
    const teamMember = this.teamMemberRepository.create(data);
    return await this.teamMemberRepository.save(teamMember);
  }

  async findById(id: string): Promise<TeamMember | null> {
    return await this.teamMemberRepository.findOne({
      where: { id },
      relations: ["team", "team.partner", "appointments", "availabilities"],
    });
  }

  async findAll(
    team_id?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<TeamMember[]> {
    const query = this.teamMemberRepository
      .createQueryBuilder("teamMember")
      .leftJoinAndSelect("teamMember.team", "team")
      .leftJoinAndSelect("team.partner", "partner");

    if (team_id) {
      query.where("teamMember.team_id = :team_id", { team_id });
    }

    query.take(limit).skip(offset);

    return await query.getMany();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.teamMemberRepository.delete(id);
    return result.affected !== 0;
  }

  async getUpcomingAppointments(id: string): Promise<any> {
    const teamMember = await this.teamMemberRepository.findOne({
      where: { id },
      relations: ["appointments", "appointments.service"],
    });

    if (!teamMember) {
      return null;
    }

    const now = new Date();
    const upcoming = teamMember.appointments.filter((apt) => {
      const aptDate = new Date(apt.appointment_date);
      return aptDate >= now;
    });

    return {
      team_member_id: teamMember.id,
      user_id: teamMember.user_id,
      upcoming_appointments: upcoming.sort(
        (a, b) =>
          new Date(a.appointment_date).getTime() -
          new Date(b.appointment_date).getTime()
      ),
    };
  }
}
