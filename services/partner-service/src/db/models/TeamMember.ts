import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Team } from "./Team";
import { Partner } from "./Partner";

@Entity({ name: "team_members", schema: "partner" })
export class TeamMember {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @Column({ type: "varchar", length: 255 })
  @Index()
  external_uid: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  joined_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Partner, (partner) => partner.uid)
  @JoinColumn({ name: "partner_uid" })
  partner: Partner;

  @ManyToMany(() => Team)
  @JoinTable({
    name: "team_members_teams",
  })
  teams: Team[];
}
