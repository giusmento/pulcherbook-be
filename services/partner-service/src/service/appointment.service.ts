import { injectable } from "inversify";
import { Repository } from "typeorm";
import { Appointment, AppointmentStatus } from "../db/models";
import {
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  UpdateAppointmentStatusRequest,
  CheckAvailabilityRequest,
} from "../types/types";
import { AppDataSource } from "../data-source";

@injectable()
export class AppointmentService {
  private appointmentRepository: Repository<Appointment>;

  constructor() {
    this.appointmentRepository = AppDataSource.getRepository(Appointment);
  }

  async create(data: CreateAppointmentRequest): Promise<Appointment> {
    // Calculate end_time based on start_time and duration
    const [hours, minutes] = data.start_time.split(":");
    const startMinutes = parseInt(hours) * 60 + parseInt(minutes);
    const endMinutes = startMinutes + data.duration_minutes;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const end_time = `${String(endHours).padStart(2, "0")}:${String(
      endMins
    ).padStart(2, "0")}`;

    const appointment = this.appointmentRepository.create({
      ...data,
      end_time,
    });

    return await this.appointmentRepository.save(appointment);
  }

  async findById(id: string): Promise<Appointment | null> {
    return await this.appointmentRepository.findOne({
      where: { id },
      relations: ["teamMember", "teamMember.team", "service"],
    });
  }

  async findAll(
    customer_user_id?: string,
    team_member_id?: string,
    service_id?: string,
    status?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Appointment[]> {
    const query = this.appointmentRepository
      .createQueryBuilder("appointment")
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

  async update(
    id: string,
    data: UpdateAppointmentRequest
  ): Promise<Appointment | null> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });
    if (!appointment) {
      return null;
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

    return await this.appointmentRepository.save(appointment);
  }

  async updateStatus(
    id: string,
    data: UpdateAppointmentStatusRequest
  ): Promise<Appointment | null> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });
    if (!appointment) {
      return null;
    }

    appointment.status = data.status as AppointmentStatus;
    if (data.cancellation_reason) {
      appointment.cancellation_reason = data.cancellation_reason;
    }

    return await this.appointmentRepository.save(appointment);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.appointmentRepository.delete(id);
    return result.affected !== 0;
  }

  async checkAvailability(data: CheckAvailabilityRequest): Promise<boolean> {
    const { team_member_id, appointment_date, duration_minutes } = data;

    // Check for overlapping appointments
    const existingAppointments = await this.appointmentRepository
      .createQueryBuilder("appointment")
      .where("appointment.team_member_id = :team_member_id", { team_member_id })
      .andWhere("appointment.appointment_date = :appointment_date", {
        appointment_date,
      })
      .andWhere("appointment.status IN (:...statuses)", {
        statuses: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
      })
      .getMany();

    // For a complete implementation, you would check time overlaps here
    // This is a simplified version
    return existingAppointments.length === 0;
  }
}
