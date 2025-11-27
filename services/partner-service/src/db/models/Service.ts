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
import { TeamService } from "./TeamService";
import { Appointment } from "./Appointment";
import { Shop } from "./Shop";
import { ServiceStatus } from "../../catalog/enums";

@Entity({ name: "services", schema: "partner" })
export class Service {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @Column({ type: "uuid", name: "partner_id" })
  @Index()
  partnerId: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "int", name: "duration_minutes" })
  durationMinutes: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "varchar", length: 3, default: "USD" })
  currency: string;

  @Column({
    type: "enum",
    enum: ServiceStatus,
    default: ServiceStatus.ACTIVE,
  })
  status: ServiceStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Shop, (shop) => shop.services)
  @JoinColumn({ name: "shop_uid" })
  shop: Shop;

  @OneToMany(() => TeamService, (teamService) => teamService.service)
  teamServices: TeamService[];

  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointments: Appointment[];
}
