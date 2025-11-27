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

@Entity({ name: "shop_working_hours", schema: "partner" })
export class ShopWorkingHours {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @ManyToOne(() => Shop, (shop) => shop.workingHours)
  @JoinColumn({ name: "shop_uid" })
  @Index()
  shop: Shop;

  // Day of week: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  @Column({ type: "smallint", name: "day_of_week" })
  @Index()
  dayOfWeek: number;

  // Time slots stored as time without timezone
  @Column({ type: "time", name: "start_time" })
  startTime: string; // e.g., "08:00:00"

  @Column({ type: "time", name: "end_time" })
  endTime: string; // e.g., "13:00:00"

  // For ordering multiple slots in the same day
  @Column({ type: "smallint", default: 0, name: "slot_order" })
  slotOrder: number;

  @Column({ type: "boolean", default: true, name: "is_active" })
  isActive: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
