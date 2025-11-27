import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Partner } from "./Partner";
import { Shop } from "./Shop";

export enum BusinessTypeStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

@Entity({ name: "business_types", schema: "partner" })
export class BusinessType {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @Column({ type: "varchar", length: 255, unique: true })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: BusinessTypeStatus,
    default: BusinessTypeStatus.ACTIVE,
  })
  status: BusinessTypeStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // Relations
  @OneToMany(() => Partner, (partner) => partner.businessType)
  partners: Partner[];

  @OneToMany(() => Shop, (shop) => shop.businessType)
  shops: Shop[];
}
