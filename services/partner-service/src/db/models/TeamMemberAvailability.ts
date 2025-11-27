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

@Entity({ name: "team_member_availability", schema: "partner" })
export class TeamMemberAvailability {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @Column({ type: "uuid", name: "team_member_id" })
  @Index()
  teamMemberId: string;

  @Column({ type: "int", nullable: true, name: "day_of_week" })
  dayOfWeek: number; // 0-6 (Sunday to Saturday)

  @Column({ type: "date", nullable: true, name: "specific_date" })
  @Index()
  specificDate: Date;

  @Column({ type: "time", name: "start_time" })
  startTime: string;

  @Column({ type: "time", name: "end_time" })
  endTime: string;

  @Column({ type: "boolean", default: true, name: "is_recurring" })
  isRecurring: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // Relations
  //@ManyToOne(() => TeamMember, (member) => member.availabilities, {
  //  onDelete: "CASCADE",
  //})
  //@JoinColumn({ name: "team_member_id" })
  //teamMember: TeamMember;
}
