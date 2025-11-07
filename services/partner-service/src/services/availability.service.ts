import { injectable } from "inversify";
import { EntityManager } from "typeorm";
import { errors } from "@giusmento/mangojs-core";
import * as models from "../db/models";
import { AppDataSource } from "../data-source";
import {
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  GetAvailableSlotsRequest,
  TimeSlot,
} from "../types/types";

@injectable()
export class AvailabilityService {
  constructor() {}


  async create(data: CreateAvailabilityRequest): Promise<models.TeamMemberAvailability> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        // Validation
        if (!data.team_member_id) {
          throw new errors.APIError(400, "BAD_REQUEST", "Team member ID is required");
        }
        if (!data.start_time) {
          throw new errors.APIError(400, "BAD_REQUEST", "Start time is required");
        }
        if (!data.end_time) {
          throw new errors.APIError(400, "BAD_REQUEST", "End time is required");
        }

        // Create and save using em
        const availability = em.create(models.TeamMemberAvailability, data);
        await em.save(availability);
        return availability;
      }
    );
    return response;
  }

  async findById(uid: string): Promise<models.TeamMemberAvailability> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        const availability = await em.findOne(models.TeamMemberAvailability, {
          where: { uid },
          relations: ["teamMember", "teamMember.team"],
        });

        if (!availability) {
          throw new errors.APIError(404, "NOT_FOUND", "Availability not found");
        }

        return availability;
      }
    );
    return response;
  }

  async findAll(
    team_member_id?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<models.TeamMemberAvailability[]> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        const query = em
          .createQueryBuilder(models.TeamMemberAvailability, "availability")
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
    );
    return response;
  }

  async update(
    uid: string,
    data: UpdateAvailabilityRequest
  ): Promise<models.TeamMemberAvailability> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        const availability = await em.findOne(models.TeamMemberAvailability, {
          where: { uid },
        });
        if (!availability) {
          throw new errors.APIError(404, "NOT_FOUND", "Availability not found");
        }

        Object.assign(availability, data);
        await em.save(availability);
        return availability;
      }
    );
    return response;
  }

  async delete(uid: string): Promise<boolean> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        const availability = await em.findOne(models.TeamMemberAvailability, {
          where: { uid },
        });
        if (!availability) {
          throw new errors.APIError(404, "NOT_FOUND", "Availability not found");
        }

        await em.remove(availability);
        return true;
      }
    );
    return response;
  }

  async getAvailableSlots(
    data: GetAvailableSlotsRequest
  ): Promise<TimeSlot[]> {
    const response = await AppDataSource.transaction(async (em: EntityManager) => {
        const { team_member_id, date, service_id } = data;

        // Get day of week from date (0 = Sunday, 6 = Saturday)
        const dateObj = new Date(date);
        const dayOfWeek = dateObj.getDay();

        // Get availability rules for this team member
        const availabilities = await em
          .createQueryBuilder(models.TeamMemberAvailability, "availability")
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
    );
    return response;
  }
}
