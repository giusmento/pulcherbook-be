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
import { Partner } from "./Partner";

export enum MediaType {
  LOGO = "logo",
  COVER = "cover",
  GALLERY = "gallery",
}

@Entity({ name: "company_media", schema: "partner" })
export class CompanyMedia {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @Column({ type: "uuid" })
  @Index()
  partner_id: string;

  @Column({ type: "varchar", length: 500 })
  url: string;

  @Column({
    type: "enum",
    enum: MediaType,
  })
  type: MediaType;

  @Column({ type: "int", default: 0 })
  display_order: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  alt_text: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @JoinColumn({ name: "partner_id" })
  partner: Partner;
}
