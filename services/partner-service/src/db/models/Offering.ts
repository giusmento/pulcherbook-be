import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from "typeorm";
import { Appointment } from "./Appointment";
import { Shop } from "./Shop";
import { BookingAlgorithm, OfferingStatus } from "../../catalog/enums";
import { Team } from "./Team";
import { OfferingCategory } from "./OfferingCategory";

@Entity({ name: "offerings", schema: "partner" })
export class Offering {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @Column({ type: "uuid", name: "partner_uid" })
  @Index()
  partnerUid: string;

  @Column({ type: "uuid", name: "category_uid", nullable: true })
  @Index()
  categoryUid: string | null;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: BookingAlgorithm,
    default: BookingAlgorithm.DIRECT_TO_TEAM_MEMBER,
    name: "booking_algorithm",
  })
  bookingAlgorithm: BookingAlgorithm;

  @Column({ type: "int", name: "duration_minutes" })
  durationMinutes: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "varchar", length: 3, default: "USD" })
  currency: string;

  @Column({
    type: "boolean",
    name: "is_booked_online",
    default: true,
  })
  isBookedOnline: boolean;

  @Column({
    type: "boolean",
    name: "is_required_confirmation",
    default: false,
  })
  isRequiredConfirmation: boolean;

  @Column({
    type: "boolean",
    name: "is_required_consulting",
    default: false,
  })
  isRequiredConsulting: boolean;

  @Column({
    type: "enum",
    enum: OfferingStatus,
    default: OfferingStatus.ACTIVE,
  })
  status: OfferingStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt: Date | null;

  // Relations
  @ManyToMany(() => Shop, (shop) => shop.uid)
  @JoinTable({
    name: "offerings_shops",
  })
  shops: Shop[];

  @ManyToMany(() => Team, (team) => team.uid)
  @JoinTable({
    name: "offerings_teams",
  })
  teams: Team[];

  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointments: Appointment[];

  @ManyToOne(() => OfferingCategory, (category) => category.offerings, {
    nullable: true,
  })
  @JoinColumn({ name: "category_uid" })
  category: OfferingCategory | null;
}
