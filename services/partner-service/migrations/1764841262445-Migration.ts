import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764841262445 implements MigrationInterface {
    name = 'Migration1764841262445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."offering_categories" ADD "type" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "partner"."teams" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."teams" ALTER COLUMN "tags" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "partner"."offering_categories" DROP COLUMN "type"`);
    }

}
