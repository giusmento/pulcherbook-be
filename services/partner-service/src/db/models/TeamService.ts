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
@Unique(["teamId", "serviceId"])
export class TeamService {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @Column({ type: "uuid", name: "team_id" })
  @Index()
  teamId: string;

  @Column({ type: "uuid", name: "service_id" })
  @Index()
  serviceId: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

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
