import { injectable, inject, LazyServiceIdentifier } from "inversify";
import { EntityManager } from "typeorm";
import {
  errors,
  INVERSITY_TYPES,
  IPersistenceContext,
} from "@giusmento/mangojs-core";
import * as models from "../db/models";
import {
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  UpdateAppointmentStatusRequest,
  CheckAvailabilityRequest,
} from "../types/types";

@injectable()
export class AppointmentService {
  @inject(new LazyServiceIdentifier(() => INVERSITY_TYPES.PersistenceContext))
  private _persistenceContext: IPersistenceContext;

  constructor() {}

  /**
   * Create Appointment - Create a new appointment with validation
   *
   * @param data - Appointment creation data
   * @returns Promise resolving to the created appointment
   * @throws {APIError} 400 BAD_REQUEST if validation fails
   */
  public async create(data: CreateAppointmentRequest): Promise<models.Appointment> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        // Validation
        if (!data.customerUserId) {
          throw new errors.APIError(400, "BAD_REQUEST", "Customer user ID is required");
        }
        if (!data.teamMemberId) {
          throw new errors.APIError(400, "BAD_REQUEST", "Team member ID is required");
        }
        if (!data.serviceId) {
          throw new errors.APIError(400, "BAD_REQUEST", "Service ID is required");
        }
        if (!data.appointmentDate) {
          throw new errors.APIError(400, "BAD_REQUEST", "Appointment date is required");
        }
        if (!data.startTime) {
          throw new errors.APIError(400, "BAD_REQUEST", "Start time is required");
        }
        if (!data.durationMinutes || data.durationMinutes <= 0) {
          throw new errors.APIError(400, "BAD_REQUEST", "Valid duration is required");
        }

        // Calculate endTime based on startTime and duration
        const [hours, minutes] = data.startTime.split(":");
        const startMinutes = parseInt(hours) * 60 + parseInt(minutes);
        const endMinutes = startMinutes + data.durationMinutes;
        const endHours = Math.floor(endMinutes / 60);
        const endMins = endMinutes % 60;
        const endTime = `${String(endHours).padStart(2, "0")}:${String(
          endMins
        ).padStart(2, "0")}`;

        const appointment = em.create(models.Appointment, {
          ...data,
          endTime,
        });

        await em.save(appointment);
        return appointment;
      }
    );
    return response as models.Appointment;
  }

  /**
   * Get Appointment By ID - Retrieve an appointment by their ID with relations
   *
   * @param uid - Appointment ID
   * @returns Promise resolving to the appointment with team member, team, and service
   * @throws {APIError} 404 NOT_FOUND if appointment doesn't exist
   */
  public async findById(uid: string): Promise<models.Appointment> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const appointment = await em.findOne(models.Appointment, {
          where: { uid },
          relations: ["teamMember", "teamMember.team", "service"],
        });

        if (!appointment) {
          throw new errors.APIError(404, "NOT_FOUND", "Appointment not found");
        }

        return appointment;
      }
    );
    return response as models.Appointment;
  }

  /**
   * Get All Appointments - Retrieve all appointments with optional filtering
   *
   * @param customer_user_id - Optional customer user ID to filter by
   * @param team_member_id - Optional team member ID to filter by
   * @param service_id - Optional service ID to filter by
   * @param status - Optional status to filter by
   * @param limit - Number of items to return (default: 20)
   * @param offset - Number of items to skip (default: 0)
   * @returns Promise resolving to array of appointments
   */
  public async findAll(
    customer_user_id?: string,
    team_member_id?: string,
    service_id?: string,
    status?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<models.Appointment[]> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const query = em
          .createQueryBuilder(models.Appointment, "appointment")
          .leftJoinAndSelect("appointment.teamMember", "teamMember")
          .leftJoinAndSelect("teamMember.team", "team")
          .leftJoinAndSelect("appointment.service", "service")
          .orderBy("appointment.appointmentDate", "DESC")
          .addOrderBy("appointment.startTime", "DESC");

        if (customer_user_id) {
          query.andWhere("appointment.customerUserId = :customerUserId", {
            customerUserId: customer_user_id,
          });
        }

        if (team_member_id) {
          query.andWhere("appointment.teamMemberId = :teamMemberId", {
            teamMemberId: team_member_id,
          });
        }

        if (service_id) {
          query.andWhere("appointment.serviceId = :serviceId", { serviceId: service_id });
        }

        if (status) {
          query.andWhere("appointment.status = :status", { status });
        }

        query.take(limit).skip(offset);

        return await query.getMany();
      }
    );
    return response as models.Appointment[];
  }

  /**
   * Update Appointment - Update appointment information
   *
   * @param uid - Appointment ID
   * @param data - Fields to update
   * @returns Promise resolving to updated appointment
   * @throws {APIError} 404 NOT_FOUND if appointment doesn't exist
   */
  public async update(
    uid: string,
    data: UpdateAppointmentRequest
  ): Promise<models.Appointment> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const appointment = await em.findOne(models.Appointment, {
          where: { uid },
        });
        if (!appointment) {
          throw new errors.APIError(404, "NOT_FOUND", "Appointment not found");
        }

        // Recalculate endTime if startTime or duration changes
        if (data.startTime || data.durationMinutes) {
          const startTime = data.startTime || appointment.startTime;
          const duration = data.durationMinutes || appointment.durationMinutes;

          const [hours, minutes] = startTime.split(":");
          const startMinutes = parseInt(hours) * 60 + parseInt(minutes);
          const endMinutes = startMinutes + duration;
          const endHours = Math.floor(endMinutes / 60);
          const endMins = endMinutes % 60;
          const endTime = `${String(endHours).padStart(2, "0")}:${String(
            endMins
          ).padStart(2, "0")}`;

          Object.assign(appointment, { ...data, endTime });
        } else {
          Object.assign(appointment, data);
        }

        await em.save(appointment);
        return appointment;
      }
    );
    return response as models.Appointment;
  }

  /**
   * Update Appointment Status - Update appointment status and optional cancellation reason
   *
   * @param uid - Appointment ID
   * @param data - Status update data
   * @returns Promise resolving to updated appointment
   * @throws {APIError} 404 NOT_FOUND if appointment doesn't exist
   */
  public async updateStatus(
    uid: string,
    data: UpdateAppointmentStatusRequest
  ): Promise<models.Appointment> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const appointment = await em.findOne(models.Appointment, {
          where: { uid },
        });
        if (!appointment) {
          throw new errors.APIError(404, "NOT_FOUND", "Appointment not found");
        }

        appointment.status = data.status as models.AppointmentStatus;
        if (data.cancellationReason) {
          appointment.cancellationReason = data.cancellationReason;
        }

        await em.save(appointment);
        return appointment;
      }
    );
    return response as models.Appointment;
  }

  /**
   * Delete Appointment - Remove an appointment (hard delete)
   *
   * @param uid - Appointment ID
   * @returns Promise resolving to true if successful
   * @throws {APIError} 404 NOT_FOUND if appointment doesn't exist
   */
  public async delete(uid: string): Promise<boolean> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const appointment = await em.findOne(models.Appointment, { where: { uid } });
        if (!appointment) {
          throw new errors.APIError(404, "NOT_FOUND", "Appointment not found");
        }

        await em.remove(appointment);
        return true;
      }
    );
    return response as boolean;
  }

  /**
   * Check Availability - Check if a team member is available for an appointment
   *
   * @param data - Availability check data
   * @returns Promise resolving to true if available, false otherwise
   */
  public async checkAvailability(data: CheckAvailabilityRequest): Promise<boolean> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const { teamMemberId, appointmentDate, durationMinutes } = data;

        // Check for overlapping appointments
        const existingAppointments = await em
          .createQueryBuilder(models.Appointment, "appointment")
          .where("appointment.teamMemberId = :teamMemberId", { teamMemberId })
          .andWhere("appointment.appointmentDate = :appointmentDate", {
            appointmentDate,
          })
          .andWhere("appointment.status IN (:...statuses)", {
            statuses: [models.AppointmentStatus.PENDING, models.AppointmentStatus.CONFIRMED],
          })
          .getMany();

        // For a complete implementation, you would check time overlaps here
        // This is a simplified version
        return existingAppointments.length === 0;
      }
    );
    return response as boolean;
  }
}
