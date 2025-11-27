import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1763301543016 implements MigrationInterface {
    name = 'Migration1763301543016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."partners" RENAME COLUMN "business_typeUid" TO "businessTypeUid"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner"."partners" RENAME COLUMN "businessTypeUid" TO "business_typeUid"`);
    }

}
