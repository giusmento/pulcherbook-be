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
import { Shop } from "./Shop";
import { PartnerStatus } from "../../catalog/enums";
import { BusinessType } from "./BusinessType";

@Entity({ name: "partners", schema: "partner" })
export class Partner {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @Column({ type: "uuid", name: "external_uid" })
  @Index()
  externalUid: string;

  @Column({ type: "varchar", length: 255, name: "company_name" })
  companyName: string;

  @Column({ type: "text", nullable: true, name: "description" })
  description: string;

  @Column({
    type: "varchar",
    length: 500,
    nullable: true,
    name: "address_street",
  })
  addressStreet: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
    name: "address_city",
  })
  addressCity: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
    name: "address_state",
  })
  addressState: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
    name: "address_country",
  })
  addressCountry: string;

  @Column({
    type: "varchar",
    length: 20,
    nullable: true,
    name: "address_postal_code",
  })
  addressPostalCode: string;

  @Column({ type: "varchar", length: 50, nullable: true, name: "tax_code" })
  taxCode: string;

  @Column({ type: "varchar", length: 50, nullable: true, name: "phone_number" })
  phoneNumber: string;

  @Column({ type: "varchar", length: 255, nullable: true, name: "email" })
  email: string;

  @Column({ type: "varchar", length: 255, nullable: true, name: "website" })
  website: string;

  @Column({ type: "varchar", length: 255, nullable: true, name: "instagram" })
  instagram: string;

  @Column({
    type: "enum",
    enum: PartnerStatus,
    default: PartnerStatus.ACTIVE,
    name: "status",
  })
  status: PartnerStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // Relations
  @OneToMany(() => Shop, (shop) => shop.partner)
  shops: Shop[];

  @ManyToOne(() => BusinessType, (businessType) => businessType.partners)
  @JoinColumn({ name: "business_type_uid" })
  businessType: BusinessType;
}
