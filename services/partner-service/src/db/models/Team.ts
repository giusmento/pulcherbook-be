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
  ManyToMany,
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

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "text", array: true, default: () => "ARRAY[]::text[]" })
  tags: string[];

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
  @ManyToOne(() => Partner, (partner) => partner.uid)
  @JoinColumn({ name: "partner_uid" })
  partner: Partner;

  @ManyToMany(() => TeamMember)
  members: TeamMember[];

  @OneToMany(() => TeamService, (teamService) => teamService.team)
  teamServices: TeamService[];
}
