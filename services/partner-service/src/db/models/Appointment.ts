import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { TeamMember } from "./TeamMember";
import { Service } from "./Service";

export enum AppointmentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
  NO_SHOW = "no_show",
}

@Entity({ name: "appointments", schema: "partner" })
@Index(["teamMemberId", "appointmentDate", "startTime"])
export class Appointment {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @Column({ type: "varchar", length: 255, name: "customer_user_id" })
  @Index()
  customerUserId: string;

  @Column({ type: "uuid", name: "team_member_id" })
  @Index()
  teamMemberId: string;

  @Column({ type: "uuid", name: "service_id" })
  @Index()
  serviceId: string;

  @Column({ type: "date", name: "appointment_date" })
  @Index()
  appointmentDate: Date;

  @Column({ type: "time", name: "start_time" })
  startTime: string;

  @Column({ type: "time", name: "end_time" })
  endTime: string;

  @Column({ type: "int", name: "duration_minutes" })
  durationMinutes: number;

  @Column({
    type: "enum",
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({ type: "text", nullable: true })
  notes: string;

  @Column({ type: "text", nullable: true, name: "customer_notes" })
  customerNotes: string;

  @Column({ type: "text", nullable: true, name: "cancellation_reason" })
  cancellationReason: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // Relations
  //@ManyToOne(() => TeamMember, (member) => member.appointments, {
  //  onDelete: "CASCADE",
  //})
  //@JoinColumn({ name: "team_member_id" })
  //teamMember: TeamMember;

  @ManyToOne(() => Service, (service) => service.appointments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "service_id" })
  service: Service;
}
