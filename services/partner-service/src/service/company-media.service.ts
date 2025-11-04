import { injectable } from "inversify";
import { Repository } from "typeorm";
import { CompanyMedia, MediaType } from "../db/models";
import {
  CreateCompanyMediaRequest,
  UpdateCompanyMediaRequest,
} from "../types/types";
import { AppDataSource } from "../data-source";

@injectable()
export class CompanyMediaService {
  private companyMediaRepository: Repository<CompanyMedia>;

  constructor() {
    this.companyMediaRepository = AppDataSource.getRepository(CompanyMedia);
  }

  async create(data: CreateCompanyMediaRequest): Promise<CompanyMedia> {
    const media = this.companyMediaRepository.create({
      ...data,
      type: data.type as MediaType,
    });
    return await this.companyMediaRepository.save(media);
  }

  async findById(id: string): Promise<CompanyMedia | null> {
    return await this.companyMediaRepository.findOne({
      where: { id },
      relations: ["partner"],
    });
  }

  async findAll(
    partner_id?: string,
    type?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<CompanyMedia[]> {
    const query = this.companyMediaRepository
      .createQueryBuilder("media")
      .leftJoinAndSelect("media.partner", "partner")
      .orderBy("media.display_order", "ASC");

    if (partner_id) {
      query.where("media.partner_id = :partner_id", { partner_id });
    }

    if (type) {
      query.andWhere("media.type = :type", { type });
    }

    query.take(limit).skip(offset);

    return await query.getMany();
  }

  async update(
    id: string,
    data: UpdateCompanyMediaRequest
  ): Promise<CompanyMedia | null> {
    const media = await this.companyMediaRepository.findOne({ where: { id } });
    if (!media) {
      return null;
    }

    Object.assign(media, data);
    return await this.companyMediaRepository.save(media);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.companyMediaRepository.delete(id);
    return result.affected !== 0;
  }
}
