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

  @ManyToOne(() => Shop, (shop) => shop.working_hours)
  @JoinColumn({ name: "shop_uid" })
  @Index()
  shop: Shop;

  // Day of week: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  @Column({ type: "smallint" })
  @Index()
  day_of_week: number;

  // Time slots stored as time without timezone
  @Column({ type: "time" })
  start_time: string; // e.g., "08:00:00"

  @Column({ type: "time" })
  end_time: string; // e.g., "13:00:00"

  // For ordering multiple slots in the same day
  @Column({ type: "smallint", default: 0 })
  slot_order: number;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
