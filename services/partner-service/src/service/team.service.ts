import { injectable } from "inversify";
import { Repository } from "typeorm";
import { Team, TeamStatus } from "../db/models";
import { CreateTeamRequest, UpdateTeamRequest } from "../types/types";
import { AppDataSource } from "../data-source";

@injectable()
export class TeamService {
  private teamRepository: Repository<Team>;

  constructor() {
    this.teamRepository = AppDataSource.getRepository(Team);
  }

  async create(data: CreateTeamRequest): Promise<Team> {
    const team = this.teamRepository.create(data);
    return await this.teamRepository.save(team);
  }

  async findById(id: string): Promise<Team | null> {
    return await this.teamRepository.findOne({
      where: { id },
      relations: ["partner", "members", "teamServices", "teamServices.service"],
    });
  }

  async findAll(
    partner_id?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Team[]> {
    const query = this.teamRepository
      .createQueryBuilder("team")
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

  async update(id: string, data: UpdateTeamRequest): Promise<Team | null> {
    const team = await this.teamRepository.findOne({ where: { id } });
    if (!team) {
      return null;
    }

    Object.assign(team, data);
    return await this.teamRepository.save(team);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.teamRepository.delete(id);
    return result.affected !== 0;
  }
}
