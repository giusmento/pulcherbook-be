import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { Team } from "./Team";
import { Service } from "./Service";
import { CompanyMedia } from "./CompanyMedia";
import { PartnerStatus } from "../../catalog/enums";
import { BusinessType } from "./BusinessType";

@Entity({ name: "partners", schema: "partner" })
export class Partner {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @Column({ type: "varchar", length: 255 })
  @Index()
  owner_user_id: string;

  @Column({ type: "varchar", length: 255 })
  company_name: string;

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

  @Column({
    type: "enum",
    enum: PartnerStatus,
    default: PartnerStatus.ACTIVE,
  })
  status: PartnerStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => BusinessType, (businessType) => businessType.partners)
  businessType: BusinessType;

  @OneToMany(() => Team, (team) => team.partner)
  teams: Team[];

  @OneToMany(() => Service, (service) => service.partner)
  services: Service[];

  @OneToMany(() => CompanyMedia, (media) => media.partner)
  media: CompanyMedia[];
}
