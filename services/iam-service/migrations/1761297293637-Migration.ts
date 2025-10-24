import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1761297293637 implements MigrationInterface {
    name = 'Migration1761297293637'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "iam"."partners_status_enum" AS ENUM('PENDING', 'UNDER_REVIEW', 'ACTIVE', 'DISABLED')`);
        await queryRunner.query(`CREATE TABLE "iam"."partners" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "companyName" character varying(255) NOT NULL, "businessType" character varying(100), "taxId" character varying(100), "email" character varying(255) NOT NULL, "phoneNumber" character varying(50), "addressStreet" character varying(255), "addressCity" character varying(100), "addressState" character varying(100), "addressCountry" character varying(100), "addressPostalCode" character varying(20), "websiteUrl" character varying(500), "logoUrl" character varying(500), "status" "iam"."partners_status_enum" NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, "subscriptionTier" character varying(50), "contractStartDate" TIMESTAMP WITH TIME ZONE, "contractEndDate" TIMESTAMP WITH TIME ZONE, "verifiedAt" TIMESTAMP WITH TIME ZONE, "disabledAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_c603b392f770df7b7773cb6f03f" UNIQUE ("taxId"), CONSTRAINT "UQ_6b39bc13ab676e74eada2e744db" UNIQUE ("email"), CONSTRAINT "PK_ec2641a1f489e8dce97ff87ab0b" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`ALTER TABLE "iam"."partner_users" ADD "partnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "iam"."partner_users" ADD CONSTRAINT "FK_dae56df395ba6667947e10f0f64" FOREIGN KEY ("partnerId") REFERENCES "iam"."partners"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "iam"."partner_users" DROP CONSTRAINT "FK_dae56df395ba6667947e10f0f64"`);
        await queryRunner.query(`ALTER TABLE "iam"."partner_users" DROP COLUMN "partnerId"`);
        await queryRunner.query(`DROP TABLE "iam"."partners"`);
        await queryRunner.query(`DROP TYPE "iam"."partners_status_enum"`);
    }

}
