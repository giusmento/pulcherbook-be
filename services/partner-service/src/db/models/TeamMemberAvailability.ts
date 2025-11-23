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

  @Column({ type: "uuid" })
  @Index()
  team_member_id: string;

  @Column({ type: "int", nullable: true })
  day_of_week: number; // 0-6 (Sunday to Saturday)

  @Column({ type: "date", nullable: true })
  @Index()
  specific_date: Date;

  @Column({ type: "time" })
  start_time: string;

  @Column({ type: "time" })
  end_time: string;

  @Column({ type: "boolean", default: true })
  is_recurring: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  //@ManyToOne(() => TeamMember, (member) => member.availabilities, {
  //  onDelete: "CASCADE",
  //})
  //@JoinColumn({ name: "team_member_id" })
  //teamMember: TeamMember;
}
