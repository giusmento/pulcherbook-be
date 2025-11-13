import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from "typeorm";
import { Team } from "./Team";
import { Service } from "./Service";

@Entity({ name: "team_services", schema: "partner" })
@Unique(["team_id", "service_id"])
export class TeamService {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @Column({ type: "uuid" })
  @Index()
  team_id: string;

  @Column({ type: "uuid" })
  @Index()
  service_id: string;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => Team, (team) => team.teamServices, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "team_id" })
  team: Team;

  @ManyToOne(() => Service, (service) => service.teamServices, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "service_id" })
  service: Service;
}
