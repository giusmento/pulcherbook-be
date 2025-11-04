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

@Entity("company_media")
export class CompanyMedia {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: string;

  @Column({ type: "bigint" })
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

  // Relations
  @ManyToOne(() => Partner, (partner) => partner.media, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "partner_id" })
  partner: Partner;
}
