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
  DELETED = "deleted",
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

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt: Date | null;

  // Relations
  @ManyToOne(() => Partner, (partner) => partner.uid)
  @JoinColumn({ name: "partner_uid" })
  partner: Partner;

  @ManyToMany(() => TeamMember)
  members: TeamMember[];

  @OneToMany(() => TeamService, (teamService) => teamService.team)
  teamServices: TeamService[];
}
