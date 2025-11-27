import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1763292451477 implements MigrationInterface {
    name = 'Migration1763292451477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."business_types" DROP CONSTRAINT "FK_bea7ec24b1f620560f3b51287b1"`);
        await queryRunner.query(`ALTER TABLE "partner"."company_media" DROP CONSTRAINT "FK_78f1ef3612b803bbd1c003c4272"`);
        await queryRunner.query(`DROP INDEX "partner"."IDX_acf7d7d1b75748f31d9ab70373"`);
        await queryRunner.query(`ALTER TABLE "partner"."business_types" DROP COLUMN "partnersUid"`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" ADD "businessTypeUid" uuid`);
        await queryRunner.query(`CREATE INDEX "IDX_1a2056a29f0e74a158867fb827" ON "partner"."partners" ("external_uid") `);
        await queryRunner.query(`ALTER TABLE "partner"."partners" ADD CONSTRAINT "FK_4664a8f33d3b91395e10bdb6ea5" FOREIGN KEY ("businessTypeUid") REFERENCES "partner"."business_types"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."partners" DROP CONSTRAINT "FK_4664a8f33d3b91395e10bdb6ea5"`);
        await queryRunner.query(`DROP INDEX "partner"."IDX_1a2056a29f0e74a158867fb827"`);
        await queryRunner.query(`ALTER TABLE "partner"."partners" DROP COLUMN "businessTypeUid"`);
        await queryRunner.query(`ALTER TABLE "partner"."business_types" ADD "partnersUid" uuid`);
        await queryRunner.query(`CREATE INDEX "IDX_acf7d7d1b75748f31d9ab70373" ON "partner"."partners" ("external_uid") `);
        await queryRunner.query(`ALTER TABLE "partner"."company_media" ADD CONSTRAINT "FK_78f1ef3612b803bbd1c003c4272" FOREIGN KEY ("partner_id") REFERENCES "partner"."partners"("uid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partner"."business_types" ADD CONSTRAINT "FK_bea7ec24b1f620560f3b51287b1" FOREIGN KEY ("partnersUid") REFERENCES "partner"."partners"("uid") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
