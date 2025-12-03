import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764690440114 implements MigrationInterface {
    name = 'Migration1764690440114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."teams" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."teams" ALTER COLUMN "tags" SET DEFAULT ARRAY[]`);
    }

}
