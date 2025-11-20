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
} from "typeorm";
import { Partner } from "./Partner";
import { TeamMember } from "./TeamMember";
import { TeamService } from "./TeamService";
import { Shop } from "./Shop";

export enum TeamStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

@Entity({ name: "teams", schema: "partner" })
export class Team {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @Column({ type: "uuid" })
  @Index()
  partner_id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: TeamStatus,
    default: TeamStatus.ACTIVE,
  })
  status: TeamStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => TeamMember, (member) => member.team)
  members: TeamMember[];

  @OneToMany(() => TeamService, (teamService) => teamService.team)
  teamServices: TeamService[];
}
