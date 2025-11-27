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

  @Column({ type: "varchar", length: 255, name: "shop_name" })
  shopName: string;

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

  @Column({
    type: "decimal",
    precision: 10,
    scale: 8,
    nullable: true,
    name: "latitude",
  })
  latitude: number;

  @Column({
    type: "decimal",
    precision: 11,
    scale: 8,
    nullable: true,
    name: "longitude",
  })
  longitude: number;

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
    enum: ShopStatus,
    default: ShopStatus.ONLINE,
    name: "status",
  })
  status: ShopStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Partner, (partner) => partner.shops)
  @JoinColumn({ name: "partner_uid" })
  partner: Partner;

  @ManyToOne(() => BusinessType, (businessType) => businessType.shops)
  @JoinColumn({ name: "business_type_uid" })
  businessType: BusinessType;

  @OneToMany(() => Service, (service) => service.shop)
  services: Service[];

  @OneToMany(() => ShopWorkingHours, (hours) => hours.shop)
  workingHours: ShopWorkingHours[];

  @OneToMany(() => ShopSpecialHours, (hours) => hours.shop)
  specialHours: ShopSpecialHours[];
}
