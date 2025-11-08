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
        if (!data.customer_user_id) {
          throw new errors.APIError(400, "BAD_REQUEST", "Customer user ID is required");
        }
        if (!data.team_member_id) {
          throw new errors.APIError(400, "BAD_REQUEST", "Team member ID is required");
        }
        if (!data.service_id) {
          throw new errors.APIError(400, "BAD_REQUEST", "Service ID is required");
        }
        if (!data.appointment_date) {
          throw new errors.APIError(400, "BAD_REQUEST", "Appointment date is required");
        }
        if (!data.start_time) {
          throw new errors.APIError(400, "BAD_REQUEST", "Start time is required");
        }
        if (!data.duration_minutes || data.duration_minutes <= 0) {
          throw new errors.APIError(400, "BAD_REQUEST", "Valid duration is required");
        }

        // Calculate end_time based on start_time and duration
        const [hours, minutes] = data.start_time.split(":");
        const startMinutes = parseInt(hours) * 60 + parseInt(minutes);
        const endMinutes = startMinutes + data.duration_minutes;
        const endHours = Math.floor(endMinutes / 60);
        const endMins = endMinutes % 60;
        const end_time = `${String(endHours).padStart(2, "0")}:${String(
          endMins
        ).padStart(2, "0")}`;

        const appointment = em.create(models.Appointment, {
          ...data,
          end_time,
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
          .orderBy("appointment.appointment_date", "DESC")
          .addOrderBy("appointment.start_time", "DESC");

        if (customer_user_id) {
          query.andWhere("appointment.customer_user_id = :customer_user_id", {
            customer_user_id,
          });
        }

        if (team_member_id) {
          query.andWhere("appointment.team_member_id = :team_member_id", {
            team_member_id,
          });
        }

        if (service_id) {
          query.andWhere("appointment.service_id = :service_id", { service_id });
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

        // Recalculate end_time if start_time or duration changes
        if (data.start_time || data.duration_minutes) {
          const startTime = data.start_time || appointment.start_time;
          const duration = data.duration_minutes || appointment.duration_minutes;

          const [hours, minutes] = startTime.split(":");
          const startMinutes = parseInt(hours) * 60 + parseInt(minutes);
          const endMinutes = startMinutes + duration;
          const endHours = Math.floor(endMinutes / 60);
          const endMins = endMinutes % 60;
          const end_time = `${String(endHours).padStart(2, "0")}:${String(
            endMins
          ).padStart(2, "0")}`;

          Object.assign(appointment, { ...data, end_time });
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
        if (data.cancellation_reason) {
          appointment.cancellation_reason = data.cancellation_reason;
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
        const { team_member_id, appointment_date, duration_minutes } = data;

        // Check for overlapping appointments
        const existingAppointments = await em
          .createQueryBuilder(models.Appointment, "appointment")
          .where("appointment.team_member_id = :team_member_id", { team_member_id })
          .andWhere("appointment.appointment_date = :appointment_date", {
            appointment_date,
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
