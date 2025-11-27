import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { Shop } from "./Shop";

@Entity({ name: "shop_special_hours", schema: "partner" })
export class ShopSpecialHours {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @ManyToOne(() => Shop, (shop) => shop.specialHours)
  @JoinColumn({ name: "shop_uid" })
  @Index()
  shop: Shop;

  // Specific date for the exception
  @Column({ type: "date", name: "special_date" })
  @Index()
  specialDate: Date; // e.g., "2025-12-25" for Christmas

  // Optional: for recurring annual events
  @Column({ type: "boolean", default: false, name: "is_recurring_annual" })
  isRecurringAnnual: boolean; // If true, applies every year

  // Time slots (nullable for closed days)
  @Column({ type: "time", nullable: true, name: "start_time" })
  startTime: string;

  @Column({ type: "time", nullable: true, name: "end_time" })
  endTime: string;

  // For multiple slots on special days
  @Column({ type: "smallint", default: 0, name: "slot_order" })
  slotOrder: number;

  // If true, the shop is closed this day (overrides regular hours)
  @Column({ type: "boolean", default: false, name: "is_closed" })
  isClosed: boolean;

  // Optional description (e.g., "Christmas Day", "Summer Holiday")
  @Column({ type: "varchar", length: 255, nullable: true })
  description: string;

  @Column({ type: "boolean", default: true, name: "is_active" })
  isActive: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
