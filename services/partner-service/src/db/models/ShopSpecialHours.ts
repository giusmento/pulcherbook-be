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

  @ManyToOne(() => Shop, (shop) => shop.special_hours)
  @JoinColumn({ name: "shop_uid" })
  @Index()
  shop: Shop;

  // Specific date for the exception
  @Column({ type: "date" })
  @Index()
  special_date: Date; // e.g., "2025-12-25" for Christmas

  // Optional: for recurring annual events
  @Column({ type: "boolean", default: false })
  is_recurring_annual: boolean; // If true, applies every year

  // Time slots (nullable for closed days)
  @Column({ type: "time", nullable: true })
  start_time: string;

  @Column({ type: "time", nullable: true })
  end_time: string;

  // For multiple slots on special days
  @Column({ type: "smallint", default: 0 })
  slot_order: number;

  // If true, the shop is closed this day (overrides regular hours)
  @Column({ type: "boolean", default: false })
  is_closed: boolean;

  // Optional description (e.g., "Christmas Day", "Summer Holiday")
  @Column({ type: "varchar", length: 255, nullable: true })
  description: string;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
