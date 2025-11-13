import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Unique,
} from "typeorm";
import { Team } from "./Team";
import { Appointment } from "./Appointment";
import { TeamMemberAvailability } from "./TeamMemberAvailability";

@Entity({ name: "team_members", schema: "partner" })
@Unique(["team_id", "user_id"])
export class TeamMember {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @Column({ type: "uuid" })
  @Index()
  team_id: string;

  @Column({ type: "varchar", length: 255 })
  @Index()
  user_id: string;

  @Column({ type: "varchar", length: 50, default: "member" })
  role: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  joined_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Team, (team) => team.members, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "team_id" })
  team: Team;

  @OneToMany(() => Appointment, (appointment) => appointment.teamMember)
  appointments: Appointment[];

  @OneToMany(
    () => TeamMemberAvailability,
    (availability) => availability.teamMember
  )
  availabilities: TeamMemberAvailability[];
}
