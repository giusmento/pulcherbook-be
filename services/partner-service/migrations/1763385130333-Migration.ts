import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1763385130333 implements MigrationInterface {
    name = 'Migration1763385130333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."shops" DROP CONSTRAINT "FK_f80a6b76ae60987c6b3b0758bf0"`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" DROP CONSTRAINT "FK_3418252413090b0f2f7a634a597"`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" DROP COLUMN "partnerUidUid"`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" DROP COLUMN "shopUid"`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" ADD "partner_uid" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" ADD "partnerUid" uuid`);
        await queryRunner.query(`CREATE INDEX "IDX_0047b2ad3728f0e29f6f8b9eaf" ON "partner"."shops" ("partner_uid") `);
        await queryRunner.query(`ALTER TABLE "partner"."shops" ADD CONSTRAINT "FK_391a3b1a6a0e80fca51068c04e5" FOREIGN KEY ("partnerUid") REFERENCES "partner"."partners"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."shops" DROP CONSTRAINT "FK_391a3b1a6a0e80fca51068c04e5"`);
        await queryRunner.query(`DROP INDEX "partner"."IDX_0047b2ad3728f0e29f6f8b9eaf"`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" DROP COLUMN "partnerUid"`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" DROP COLUMN "partner_uid"`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" ADD "shopUid" uuid`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" ADD "partnerUidUid" uuid`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" ADD CONSTRAINT "FK_3418252413090b0f2f7a634a597" FOREIGN KEY ("shopUid") REFERENCES "partner"."shops"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partner"."shops" ADD CONSTRAINT "FK_f80a6b76ae60987c6b3b0758bf0" FOREIGN KEY ("partnerUidUid") REFERENCES "partner"."partners"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
