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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Partner, (partner) => partner.businessType, {
    onDelete: "SET NULL",
  })
  partners: Partner[];
}
