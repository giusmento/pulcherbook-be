import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1763891059340 implements MigrationInterface {
    name = 'Migration1763891059340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "partner"."IDX_fde44edfeb831a0f12733b0938"`);
        await queryRunner.query(`ALTER TABLE "partner"."teams" RENAME COLUMN "partner_id" TO "partner_uid"`);
        await queryRunner.query(`ALTER TABLE "partner"."teams" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "partner"."teams" ALTER COLUMN "partner_uid" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "partner"."teams" ADD CONSTRAINT "FK_1f2f03e4b7b60896002157711e8" FOREIGN KEY ("partner_uid") REFERENCES "partner"."partners"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."teams" DROP CONSTRAINT "FK_1f2f03e4b7b60896002157711e8"`);
        await queryRunner.query(`ALTER TABLE "partner"."teams" ALTER COLUMN "partner_uid" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "partner"."teams" ALTER COLUMN "tags" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "partner"."teams" RENAME COLUMN "partner_uid" TO "partner_id"`);
        await queryRunner.query(`CREATE INDEX "IDX_fde44edfeb831a0f12733b0938" ON "partner"."teams" ("partner_id") `);
    }

}
