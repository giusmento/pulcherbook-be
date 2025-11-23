import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1763888420006 implements MigrationInterface {
    name = 'Migration1763888420006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."teams" ADD "tags" text array NOT NULL DEFAULT ARRAY[]::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."teams" DROP COLUMN "tags"`);
    }

}
