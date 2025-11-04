import { injectable } from "inversify";
import { Repository } from "typeorm";
import { Service, ServiceStatus } from "../db/models";
import { CreateServiceRequest, UpdateServiceRequest } from "../types/types";
import { AppDataSource } from "../data-source";

@injectable()
export class ServiceService {
  private serviceRepository: Repository<Service>;

  constructor() {
    this.serviceRepository = AppDataSource.getRepository(Service);
  }

  async create(data: CreateServiceRequest): Promise<Service> {
    const service = this.serviceRepository.create(data);
    return await this.serviceRepository.save(service);
  }

  async findById(id: string): Promise<Service | null> {
    return await this.serviceRepository.findOne({
      where: { id },
      relations: ["partner", "teamServices", "teamServices.team"],
    });
  }

  async findAll(
    partner_id?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Service[]> {
    const query = this.serviceRepository
      .createQueryBuilder("service")
      .leftJoinAndSelect("service.partner", "partner")
      .leftJoinAndSelect("service.teamServices", "teamServices")
      .leftJoinAndSelect("teamServices.team", "team");

    if (partner_id) {
      query.where("service.partner_id = :partner_id", { partner_id });
    }

    query.take(limit).skip(offset);

    return await query.getMany();
  }

  async update(id: string, data: UpdateServiceRequest): Promise<Service | null> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      return null;
    }

    Object.assign(service, data);
    return await this.serviceRepository.save(service);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.serviceRepository.delete(id);
    return result.affected !== 0;
  }
}
