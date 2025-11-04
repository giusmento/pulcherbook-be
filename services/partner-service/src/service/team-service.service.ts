import { injectable } from "inversify";
import { Repository } from "typeorm";
import { TeamService } from "../db/models";
import { CreateTeamServiceRequest } from "../types/types";
import { AppDataSource } from "../data-source";

@injectable()
export class TeamServiceService {
  private teamServiceRepository: Repository<TeamService>;

  constructor() {
    this.teamServiceRepository = AppDataSource.getRepository(TeamService);
  }

  async create(data: CreateTeamServiceRequest): Promise<TeamService> {
    const teamService = this.teamServiceRepository.create(data);
    return await this.teamServiceRepository.save(teamService);
  }

  async findById(id: string): Promise<TeamService | null> {
    return await this.teamServiceRepository.findOne({
      where: { id },
      relations: ["team", "service"],
    });
  }

  async findAll(
    team_id?: string,
    service_id?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<TeamService[]> {
    const query = this.teamServiceRepository
      .createQueryBuilder("teamService")
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

  async delete(id: string): Promise<boolean> {
    const result = await this.teamServiceRepository.delete(id);
    return result.affected !== 0;
  }
}
