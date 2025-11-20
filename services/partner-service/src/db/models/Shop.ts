import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  Index,
} from "typeorm";
import { Service } from "./Service";
import { Partner } from "./Partner";
import { ShopStatus } from "../../catalog/enums";
import { BusinessType } from "./BusinessType";
import { ShopWorkingHours } from "./ShopWorkingHours";
import { ShopSpecialHours } from "./ShopSpecialHours";

@Entity({ name: "shops", schema: "partner" })
export class Shop {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @Column({ type: "varchar", length: 255 })
  shop_name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  address: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  city: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  state: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  country: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  postal_code: string;

  @Column({ type: "decimal", precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  phone: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  website: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  instagram: string;

  @Column({
    type: "enum",
    enum: ShopStatus,
    default: ShopStatus.ONLINE,
  })
  status: ShopStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @Column({ type: "uuid" })
  @Index()
  partner_uid: string;

  @ManyToOne(() => Partner, (partner) => partner.shops)
  partner: Partner;

  @ManyToOne(() => BusinessType, (businessType) => businessType.shops)
  business_type: BusinessType;

  @OneToMany(() => Service, (service) => service.shop)
  services: Service[];

  @OneToMany(() => ShopWorkingHours, (hours) => hours.shop)
  working_hours: ShopWorkingHours[];

  @OneToMany(() => ShopSpecialHours, (hours) => hours.shop)
  special_hours: ShopSpecialHours[];
}
