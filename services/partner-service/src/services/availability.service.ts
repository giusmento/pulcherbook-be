import { injectable, inject, LazyServiceIdentifier } from "inversify";
import { EntityManager } from "typeorm";
import {
  errors,
  INVERSITY_TYPES,
  IPersistenceContext,
} from "@giusmento/mangojs-core";
import * as models from "../db/models";
import {
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  GetAvailableSlotsRequest,
  TimeSlot,
} from "../types/types";

@injectable()
export class AvailabilityService {
  @inject(new LazyServiceIdentifier(() => INVERSITY_TYPES.PersistenceContext))
  private _persistenceContext: IPersistenceContext;

  constructor() {}

  /**
   * Create Availability - Create a new team member availability with validation
   *
   * @param data - Availability creation data
   * @returns Promise resolving to the created availability
   * @throws {APIError} 400 BAD_REQUEST if team_member_id, start_time, or end_time is missing
   */
  public async create(data: CreateAvailabilityRequest): Promise<models.TeamMemberAvailability> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
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
    return response as models.TeamMemberAvailability;
  }

  /**
   * Get Availability By ID - Retrieve an availability by their ID with relations
   *
   * @param uid - Availability ID
   * @returns Promise resolving to the availability with team member and team
   * @throws {APIError} 404 NOT_FOUND if availability doesn't exist
   */
  public async findById(uid: string): Promise<models.TeamMemberAvailability> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
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
    return response as models.TeamMemberAvailability;
  }

  /**
   * Get All Availabilities - Retrieve all availabilities with optional filtering
   *
   * @param team_member_id - Optional team member ID to filter by
   * @param limit - Number of items to return (default: 20)
   * @param offset - Number of items to skip (default: 0)
   * @returns Promise resolving to array of availabilities ordered by day and time
   */
  public async findAll(
    team_member_id?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<models.TeamMemberAvailability[]> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
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
    return response as models.TeamMemberAvailability[];
  }

  /**
   * Update Availability - Update availability information
   *
   * @param uid - Availability ID
   * @param data - Fields to update
   * @returns Promise resolving to updated availability
   * @throws {APIError} 404 NOT_FOUND if availability doesn't exist
   */
  public async update(
    uid: string,
    data: UpdateAvailabilityRequest
  ): Promise<models.TeamMemberAvailability> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
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
    return response as models.TeamMemberAvailability;
  }

  /**
   * Delete Availability - Remove an availability (hard delete)
   *
   * @param uid - Availability ID
   * @returns Promise resolving to true if successful
   * @throws {APIError} 404 NOT_FOUND if availability doesn't exist
   */
  public async delete(uid: string): Promise<boolean> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
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
    return response as boolean;
  }

  /**
   * Get Available Slots - Get available time slots for a team member on a specific date
   *
   * @param data - Get available slots request data
   * @returns Promise resolving to array of time slots with availability status
   */
  public async getAvailableSlots(
    data: GetAvailableSlotsRequest
  ): Promise<TimeSlot[]> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
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
    return response as TimeSlot[];
  }
}
