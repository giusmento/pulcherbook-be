import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764690142006 implements MigrationInterface {
    name = 'Migration1764690142006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."offerings" DROP CONSTRAINT "FK_d54b71f3b0b4f42421f5ec4470a"`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" DROP CONSTRAINT "FK_391a3b1a6a0e80fca51068c04e5"`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" DROP CONSTRAINT "FK_50b2f02ebd8cfbc5bcbe9d98b63"`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" DROP CONSTRAINT "FK_4664a8f33d3b91395e10bdb6ea5"`);
        await queryRunner.query(`DROP INDEX "partner"."IDX_44c134d7d1f8f3b02da02160e9"`);
        await queryRunner.query(`DROP INDEX "partner"."IDX_0047b2ad3728f0e29f6f8b9eaf"`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" DROP COLUMN "partner_id"`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" DROP COLUMN "shop_uid"`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" DROP COLUMN "partnerUid"`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" ADD "partner_uid" uuid NOT NULL`);
        await queryRunner.query(`CREATE TYPE "partner"."offerings_booking_algorithm_enum" AS ENUM('direct_to_team_member', 'first_available')`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" ADD "booking_algorithm" "partner"."offerings_booking_algorithm_enum" NOT NULL DEFAULT 'direct_to_team_member'`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" ADD "is_booked_online" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" ADD "is_required_confirmation" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" ADD "is_required_consulting" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "partner"."teams" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TYPE "partner"."services_status_enum" RENAME TO "services_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "partner"."offerings_status_enum" AS ENUM('active', 'inactive', 'deleted')`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" ALTER COLUMN "status" TYPE "partner"."offerings_status_enum" USING "status"::"text"::"partner"."offerings_status_enum"`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`DROP TYPE "partner"."services_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" ALTER COLUMN "partner_uid" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" DROP COLUMN "tax_code"`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" ADD "tax_code" character varying(50)`);
        await queryRunner.query(`CREATE INDEX "IDX_fc33b91c63b1fd15cbda36dc1b" ON "partner"."offerings" ("partner_uid") `);
        await queryRunner.query(`ALTER TABLE "partner"."shops" ADD CONSTRAINT "FK_0047b2ad3728f0e29f6f8b9eafe" FOREIGN KEY ("partner_uid") REFERENCES "partner"."partners"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" ADD CONSTRAINT "FK_ac8570d4014223af6fdfc86777e" FOREIGN KEY ("business_type_uid") REFERENCES "partner"."business_types"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" ADD CONSTRAINT "FK_608cb62f0e963a0b2c1e51cefdf" FOREIGN KEY ("business_type_uid") REFERENCES "partner"."business_types"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."partners" DROP CONSTRAINT "FK_608cb62f0e963a0b2c1e51cefdf"`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" DROP CONSTRAINT "FK_ac8570d4014223af6fdfc86777e"`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" DROP CONSTRAINT "FK_0047b2ad3728f0e29f6f8b9eafe"`);
        await queryRunner.query(`DROP INDEX "partner"."IDX_fc33b91c63b1fd15cbda36dc1b"`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" DROP COLUMN "tax_code"`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" ADD "tax_code" character varying`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" ALTER COLUMN "partner_uid" SET NOT NULL`);
        await queryRunner.query(`CREATE TYPE "partner"."services_status_enum_old" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" ALTER COLUMN "status" TYPE "partner"."services_status_enum_old" USING "status"::"text"::"partner"."services_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`DROP TYPE "partner"."offerings_status_enum"`);
        await queryRunner.query(`ALTER TYPE "partner"."services_status_enum_old" RENAME TO "services_status_enum"`);
        await queryRunner.query(`ALTER TABLE "partner"."teams" ALTER COLUMN "tags" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" DROP COLUMN "is_required_consulting"`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" DROP COLUMN "is_required_confirmation"`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" DROP COLUMN "is_booked_online"`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" DROP COLUMN "booking_algorithm"`);
        await queryRunner.query(`DROP TYPE "partner"."offerings_booking_algorithm_enum"`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" DROP COLUMN "partner_uid"`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" ADD "partnerUid" uuid`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" ADD "shop_uid" uuid`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" ADD "partner_id" uuid NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_0047b2ad3728f0e29f6f8b9eaf" ON "partner"."shops" ("partner_uid") `);
        await queryRunner.query(`CREATE INDEX "IDX_44c134d7d1f8f3b02da02160e9" ON "partner"."offerings" ("partner_id") `);
        await queryRunner.query(`ALTER TABLE "partner"."partners" ADD CONSTRAINT "FK_4664a8f33d3b91395e10bdb6ea5" FOREIGN KEY ("business_type_uid") REFERENCES "partner"."business_types"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" ADD CONSTRAINT "FK_50b2f02ebd8cfbc5bcbe9d98b63" FOREIGN KEY ("business_type_uid") REFERENCES "partner"."business_types"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" ADD CONSTRAINT "FK_391a3b1a6a0e80fca51068c04e5" FOREIGN KEY ("partnerUid") REFERENCES "partner"."partners"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partner"."offerings" ADD CONSTRAINT "FK_d54b71f3b0b4f42421f5ec4470a" FOREIGN KEY ("shop_uid") REFERENCES "partner"."shops"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
