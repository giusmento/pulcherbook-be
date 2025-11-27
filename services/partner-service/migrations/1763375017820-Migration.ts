import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1763375017820 implements MigrationInterface {
    name = 'Migration1763375017820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."teams" DROP CONSTRAINT "FK_fde44edfeb831a0f12733b09383"`);
        await queryRunner.query(`ALTER TABLE "partner"."services" DROP CONSTRAINT "FK_44c134d7d1f8f3b02da02160e98"`);
        await queryRunner.query(`CREATE TYPE "partner"."shops_status_enum" AS ENUM('active', 'inactive', 'pending')`);
        await queryRunner.query(`CREATE TABLE "partner"."shops" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "shop_name" character varying(255) NOT NULL, "description" text, "address" character varying(500), "city" character varying(100), "state" character varying(100), "country" character varying(100), "postal_code" character varying(20), "latitude" numeric(10,8), "longitude" numeric(11,8), "phone" character varying(50), "email" character varying(255), "website" character varying(255), "instagram" character varying(255), "status" "partner"."shops_status_enum" NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "partnerUidUid" uuid, "businessTypeUid" uuid, CONSTRAINT "PK_e9a852225e019a0e05ea0d954b3" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "partner"."services" ADD "shop_uid" uuid`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" ADD "shopUid" uuid`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" DROP COLUMN "instagram"`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" ADD "instagram" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "partner"."services" ADD CONSTRAINT "FK_d54b71f3b0b4f42421f5ec4470a" FOREIGN KEY ("shop_uid") REFERENCES "partner"."shops"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" ADD CONSTRAINT "FK_f80a6b76ae60987c6b3b0758bf0" FOREIGN KEY ("partnerUidUid") REFERENCES "partner"."partners"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" ADD CONSTRAINT "FK_50b2f02ebd8cfbc5bcbe9d98b63" FOREIGN KEY ("businessTypeUid") REFERENCES "partner"."business_types"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" ADD CONSTRAINT "FK_3418252413090b0f2f7a634a597" FOREIGN KEY ("shopUid") REFERENCES "partner"."shops"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."partners" DROP CONSTRAINT "FK_3418252413090b0f2f7a634a597"`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" DROP CONSTRAINT "FK_50b2f02ebd8cfbc5bcbe9d98b63"`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" DROP CONSTRAINT "FK_f80a6b76ae60987c6b3b0758bf0"`);
        await queryRunner.query(`ALTER TABLE "partner"."services" DROP CONSTRAINT "FK_d54b71f3b0b4f42421f5ec4470a"`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" DROP COLUMN "instagram"`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" ADD "instagram" character varying`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" DROP COLUMN "shopUid"`);
        await queryRunner.query(`ALTER TABLE "partner"."services" DROP COLUMN "shop_uid"`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" ADD "longitude" numeric(11,8)`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" ADD "latitude" numeric(10,8)`);
        await queryRunner.query(`DROP TABLE "partner"."shops"`);
        await queryRunner.query(`DROP TYPE "partner"."shops_status_enum"`);
        await queryRunner.query(`ALTER TABLE "partner"."services" ADD CONSTRAINT "FK_44c134d7d1f8f3b02da02160e98" FOREIGN KEY ("partner_id") REFERENCES "partner"."partners"("uid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partner"."teams" ADD CONSTRAINT "FK_fde44edfeb831a0f12733b09383" FOREIGN KEY ("partner_id") REFERENCES "partner"."partners"("uid") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
