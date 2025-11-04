import { injectable } from "inversify";
import { Repository } from "typeorm";
import { TeamMemberAvailability } from "../db/models";
import {
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  GetAvailableSlotsRequest,
  TimeSlot,
} from "../types/types";
import { AppDataSource } from "../data-source";

@injectable()
export class AvailabilityService {
  private availabilityRepository: Repository<TeamMemberAvailability>;

  constructor() {
    this.availabilityRepository = AppDataSource.getRepository(TeamMemberAvailability);
  }

  async create(data: CreateAvailabilityRequest): Promise<TeamMemberAvailability> {
    const availability = this.availabilityRepository.create(data);
    return await this.availabilityRepository.save(availability);
  }

  async findById(id: string): Promise<TeamMemberAvailability | null> {
    return await this.availabilityRepository.findOne({
      where: { id },
      relations: ["teamMember", "teamMember.team"],
    });
  }

  async findAll(
    team_member_id?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<TeamMemberAvailability[]> {
    const query = this.availabilityRepository
      .createQueryBuilder("availability")
      .leftJoinAndSelect("availability.teamMember", "teamMember")
      .orderBy("availability.day_of_week", "ASC")
      .addOrderBy("availability.start_time", "ASC");

    if (team_member_id) {
      query.where("availability.team_member_id = :team_member_id", {
        team_member_id,
      });
    }

    query.take(limit).skip(offset);

    return await query.getMany();
  }

  async update(
    id: string,
    data: UpdateAvailabilityRequest
  ): Promise<TeamMemberAvailability | null> {
    const availability = await this.availabilityRepository.findOne({
      where: { id },
    });
    if (!availability) {
      return null;
    }

    Object.assign(availability, data);
    return await this.availabilityRepository.save(availability);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.availabilityRepository.delete(id);
    return result.affected !== 0;
  }

  async getAvailableSlots(
    data: GetAvailableSlotsRequest
  ): Promise<TimeSlot[]> {
    const { team_member_id, date, service_id } = data;

    // Get day of week from date (0 = Sunday, 6 = Saturday)
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();

    // Get availability rules for this team member
    const availabilities = await this.availabilityRepository
      .createQueryBuilder("availability")
      .where("availability.team_member_id = :team_member_id", {
        team_member_id,
      })
      .andWhere(
        "(availability.day_of_week = :dayOfWeek AND availability.is_recurring = true) OR (availability.specific_date = :date AND availability.is_recurring = false)",
        { dayOfWeek, date }
      )
      .getMany();

    if (availabilities.length === 0) {
      return [];
    }

    // Generate time slots (simplified - 30-minute intervals)
    const slots: TimeSlot[] = [];
    for (const avail of availabilities) {
      const [startHour, startMin] = avail.start_time.split(":").map(Number);
      const [endHour, endMin] = avail.end_time.split(":").map(Number);

      let currentMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      while (currentMinutes < endMinutes) {
        const hours = Math.floor(currentMinutes / 60);
        const mins = currentMinutes % 60;
        const timeStr = `${String(hours).padStart(2, "0")}:${String(
          mins
        ).padStart(2, "0")}`;

        const nextMinutes = currentMinutes + 30;
        const nextHours = Math.floor(nextMinutes / 60);
        const nextMins = nextMinutes % 60;
        const nextTimeStr = `${String(nextHours).padStart(2, "0")}:${String(
          nextMins
        ).padStart(2, "0")}`;

        slots.push({
          start_time: timeStr,
          end_time: nextTimeStr,
          available: true, // TODO: Check against existing appointments
        });

        currentMinutes = nextMinutes;
      }
    }

    return slots;
  }
}
