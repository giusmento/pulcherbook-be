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

@Entity("appointments")
@Index(["team_member_id", "appointment_date", "start_time"])
export class Appointment {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @Column({ type: "varchar", length: 255 })
  @Index()
  customer_user_id: string;

  @Column({ type: "uuid" })
  @Index()
  team_member_id: string;

  @Column({ type: "uuid" })
  @Index()
  service_id: string;

  @Column({ type: "date" })
  @Index()
  appointment_date: Date;

  @Column({ type: "time" })
  start_time: string;

  @Column({ type: "time" })
  end_time: string;

  @Column({ type: "int" })
  duration_minutes: number;

  @Column({
    type: "enum",
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({ type: "text", nullable: true })
  notes: string;

  @Column({ type: "text", nullable: true })
  customer_notes: string;

  @Column({ type: "text", nullable: true })
  cancellation_reason: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => TeamMember, (member) => member.appointments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "team_member_id" })
  teamMember: TeamMember;

  @ManyToOne(() => Service, (service) => service.appointments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "service_id" })
  service: Service;
}
