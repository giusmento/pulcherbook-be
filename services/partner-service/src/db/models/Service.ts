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

  @Column({ type: "uuid" })
  @Index()
  partner_id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "int" })
  duration_minutes: number;

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Shop, (shop) => shop.services)
  @JoinColumn({ name: "shop_uid" })
  shop: Shop;

  @OneToMany(() => TeamService, (teamService) => teamService.service)
  teamServices: TeamService[];

  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointments: Appointment[];
}
