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

  @Column({ type: "uuid", name: "partner_id" })
  @Index()
  partnerId: string;

  @Column({ type: "varchar", length: 500 })
  url: string;

  @Column({
    type: "enum",
    enum: MediaType,
  })
  type: MediaType;

  @Column({ type: "int", default: 0, name: "display_order" })
  displayOrder: number;

  @Column({ type: "varchar", length: 255, nullable: true, name: "alt_text" })
  altText: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @JoinColumn({ name: "partner_id" })
  partner: Partner;
}
