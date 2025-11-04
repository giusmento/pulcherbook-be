import { injectable } from "inversify";
import { Repository } from "typeorm";
import { Partner, PartnerStatus } from "../db/models";
import {
  CreatePartnerRequest,
  UpdatePartnerRequest,
  SearchPartnersRequest,
} from "../types/types";
import { AppDataSource } from "../data-source";

@injectable()
export class PartnerService {
  private partnerRepository: Repository<Partner>;

  constructor() {
    this.partnerRepository = AppDataSource.getRepository(Partner);
  }

  async create(data: CreatePartnerRequest): Promise<Partner> {
    const partner = this.partnerRepository.create(data);
    return await this.partnerRepository.save(partner);
  }

  async findById(id: string): Promise<Partner | null> {
    return await this.partnerRepository.findOne({
      where: { id },
      relations: ["teams", "services", "media"],
    });
  }

  async findAll(limit: number = 20, offset: number = 0): Promise<Partner[]> {
    return await this.partnerRepository.find({
      take: limit,
      skip: offset,
      relations: ["teams", "services", "media"],
    });
  }

  async update(id: string, data: UpdatePartnerRequest): Promise<Partner | null> {
    const partner = await this.partnerRepository.findOne({ where: { id } });
    if (!partner) {
      return null;
    }

    Object.assign(partner, data);
    return await this.partnerRepository.save(partner);
  }

  async delete(id: string): Promise<boolean> {
    const partner = await this.partnerRepository.findOne({ where: { id } });
    if (!partner) {
      return false;
    }

    // Soft delete - set status to inactive
    partner.status = PartnerStatus.INACTIVE;
    await this.partnerRepository.save(partner);
    return true;
  }

  async search(params: SearchPartnersRequest): Promise<Partner[]> {
    const query = this.partnerRepository
      .createQueryBuilder("partner")
      .leftJoinAndSelect("partner.services", "service")
      .leftJoinAndSelect("partner.media", "media")
      .where("partner.status = :status", { status: PartnerStatus.ACTIVE });

    if (params.city) {
      query.andWhere("LOWER(partner.city) = LOWER(:city)", {
        city: params.city,
      });
    }

    if (params.service_id) {
      query.andWhere("service.id = :serviceId", {
        serviceId: params.service_id,
      });
    }

    // Location-based search
    if (params.latitude && params.longitude && params.radius) {
      const { latitude, longitude, radius } = params;
      // Haversine formula for distance calculation
      query.andWhere(
        `(
          6371 * acos(
            cos(radians(:lat)) * cos(radians(partner.latitude)) *
            cos(radians(partner.longitude) - radians(:lon)) +
            sin(radians(:lat)) * sin(radians(partner.latitude))
          )
        ) <= :radius`,
        { lat: latitude, lon: longitude, radius }
      );
    }

    query.take(params.limit || 20).skip(params.offset || 0);

    return await query.getMany();
  }

  async getAvailability(partnerId: string): Promise<any> {
    const partner = await this.partnerRepository.findOne({
      where: { id: partnerId },
      relations: [
        "teams",
        "teams.members",
        "teams.members.availabilities",
        "teams.teamServices",
        "teams.teamServices.service",
      ],
    });

    if (!partner) {
      return null;
    }

    // Structure the availability data
    return {
      partner: {
        id: partner.id,
        company_name: partner.company_name,
      },
      teams: partner.teams.map((team) => ({
        id: team.id,
        name: team.name,
        services: team.teamServices.map((ts) => ts.service),
        members: team.members.map((member) => ({
          id: member.id,
          user_id: member.user_id,
          role: member.role,
          availabilities: member.availabilities,
        })),
      })),
    };
  }
}
